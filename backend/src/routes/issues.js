import { query, queryOne, execute, transaction, getDb } from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';
import { validateIssue, validatePagination } from '../utils/validation.js';
import { NotFoundError } from '../middleware/error.js';

export default async function issuesRoutes(fastify) {
  // GET /api/issues - List issues with filtering and pagination
  fastify.get('/api/issues', async (request, reply) => {
    const { page, limit, offset } = validatePagination(request.query);
    const { status, assigned_user_id, tag_ids, search, priority, created_by_user_id } = request.query;

    let whereClauses = [];
    let params = [];

    if (status) {
      whereClauses.push('i.status = ?');
      params.push(status);
    }

    if (assigned_user_id) {
      whereClauses.push('i.assigned_user_id = ?');
      params.push(assigned_user_id);
    }

    if (created_by_user_id) {
      whereClauses.push('i.created_by_user_id = ?');
      params.push(created_by_user_id);
    }

    if (priority) {
      whereClauses.push('i.priority = ?');
      params.push(priority);
    }

    if (search) {
      whereClauses.push('(i.title LIKE ? OR i.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (tag_ids) {
      const tagIdArray = tag_ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      if (tagIdArray.length > 0) {
        const placeholders = tagIdArray.map(() => '?').join(',');
        whereClauses.push(`i.id IN (SELECT issue_id FROM issue_tag WHERE tag_id IN (${placeholders}))`);
        params.push(...tagIdArray);
      }
    }

    const whereClause = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM issue i ${whereClause}`;
    const { total } = queryOne(countQuery, params);

    // Get paginated issues
    const issuesQuery = `
      SELECT 
        i.*,
        au.id as assigned_user_id, au.name as assigned_user_name, au.email as assigned_user_email,
        cu.id as created_by_user_id, cu.name as created_by_user_name, cu.email as created_by_user_email
      FROM issue i
      LEFT JOIN user au ON i.assigned_user_id = au.id
      LEFT JOIN user cu ON i.created_by_user_id = cu.id
      ${whereClause}
      ORDER BY i.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const issues = query(issuesQuery, [...params, limit, offset]);

    // Get tags for each issue
    const issuesWithTags = issues.map(issue => {
      const tags = query(
        `SELECT t.id, t.name, t.color 
         FROM tag t
         JOIN issue_tag it ON t.id = it.tag_id
         WHERE it.issue_id = ?`,
        [issue.id]
      );

      return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        status: issue.status,
        priority: issue.priority,
        assigned_user_id: issue.assigned_user_id,
        created_by_user_id: issue.created_by_user_id,
        created_at: new Date(issue.created_at * 1000).toISOString(),
        updated_at: new Date(issue.updated_at * 1000).toISOString(),
        assigned_user: issue.assigned_user_id ? {
          id: issue.assigned_user_id,
          name: issue.assigned_user_name,
          email: issue.assigned_user_email,
        } : null,
        created_by_user: {
          id: issue.created_by_user_id,
          name: issue.created_by_user_name,
          email: issue.created_by_user_email,
        },
        tags,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      issues: issuesWithTags,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  });

  // POST /api/issues - Create a new issue
  fastify.post('/api/issues', {
    preHandler: requireAuth,
  }, async (request, reply) => {
    const data = request.body;
    validateIssue(data);

    const result = transaction(() => {
      const issueResult = execute(
        `INSERT INTO issue (title, description, status, priority, assigned_user_id, created_by_user_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.title,
          data.description || null,
          data.status || 'not_started',
          data.priority || 'medium',
          data.assigned_user_id || null,
          request.user.id,
        ]
      );

      const issueId = issueResult.lastInsertRowid;

      // Add tags if provided
      if (data.tag_ids && data.tag_ids.length > 0) {
        const stmt = getDb().prepare('INSERT INTO issue_tag (issue_id, tag_id) VALUES (?, ?)');
        for (const tagId of data.tag_ids) {
          stmt.run(issueId, tagId);
        }
      }

      return queryOne('SELECT * FROM issue WHERE id = ?', [issueId]);
    });

    reply.code(201).send({
      id: result.id,
      title: result.title,
      description: result.description,
      status: result.status,
      priority: result.priority,
      assigned_user_id: result.assigned_user_id,
      created_by_user_id: result.created_by_user_id,
      created_at: new Date(result.created_at * 1000).toISOString(),
      updated_at: new Date(result.updated_at * 1000).toISOString(),
    });
  });

  // GET /api/issues/:id - Get a single issue
  fastify.get('/api/issues/:id', async (request, reply) => {
    const { id } = request.params;

    const issue = queryOne(
      `SELECT 
        i.*,
        au.id as assigned_user_id, au.name as assigned_user_name, au.email as assigned_user_email,
        cu.id as created_by_user_id, cu.name as created_by_user_name, cu.email as created_by_user_email
      FROM issue i
      LEFT JOIN user au ON i.assigned_user_id = au.id
      LEFT JOIN user cu ON i.created_by_user_id = cu.id
      WHERE i.id = ?`,
      [id]
    );

    if (!issue) {
      throw new NotFoundError('Issue not found');
    }

    const tags = query(
      `SELECT t.id, t.name, t.color 
       FROM tag t
       JOIN issue_tag it ON t.id = it.tag_id
       WHERE it.issue_id = ?`,
      [id]
    );

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      assigned_user_id: issue.assigned_user_id,
      created_by_user_id: issue.created_by_user_id,
      created_at: new Date(issue.created_at * 1000).toISOString(),
      updated_at: new Date(issue.updated_at * 1000).toISOString(),
      assigned_user: issue.assigned_user_id ? {
        id: issue.assigned_user_id,
        name: issue.assigned_user_name,
        email: issue.assigned_user_email,
      } : null,
      created_by_user: {
        id: issue.created_by_user_id,
        name: issue.created_by_user_name,
        email: issue.created_by_user_email,
      },
      tags,
    };
  });

  // PUT /api/issues/:id - Update an issue
  fastify.put('/api/issues/:id', {
    preHandler: requireAuth,
  }, async (request, reply) => {
    const { id } = request.params;
    const data = request.body;
    validateIssue(data, true);

    // Check if issue exists
    const existing = queryOne('SELECT id FROM issue WHERE id = ?', [id]);
    if (!existing) {
      throw new NotFoundError('Issue not found');
    }

    transaction(() => {
      // Build update query dynamically
      const updates = [];
      const params = [];

      if (data.title !== undefined) {
        updates.push('title = ?');
        params.push(data.title);
      }
      if (data.description !== undefined) {
        updates.push('description = ?');
        params.push(data.description);
      }
      if (data.status !== undefined) {
        updates.push('status = ?');
        params.push(data.status);
      }
      if (data.priority !== undefined) {
        updates.push('priority = ?');
        params.push(data.priority);
      }
      if (data.assigned_user_id !== undefined) {
        updates.push('assigned_user_id = ?');
        params.push(data.assigned_user_id);
      }

      if (updates.length > 0) {
        updates.push('updated_at = strftime("%s", "now")');
        params.push(id);
        execute(
          `UPDATE issue SET ${updates.join(', ')} WHERE id = ?`,
          params
        );
      }

      // Update tags if provided
      if (data.tag_ids !== undefined) {
        execute('DELETE FROM issue_tag WHERE issue_id = ?', [id]);
        if (data.tag_ids.length > 0) {
          const stmt = getDb().prepare('INSERT INTO issue_tag (issue_id, tag_id) VALUES (?, ?)');
          for (const tagId of data.tag_ids) {
            stmt.run(id, tagId);
          }
        }
      }
    });

    const updated = queryOne('SELECT * FROM issue WHERE id = ?', [id]);
    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      status: updated.status,
      priority: updated.priority,
      assigned_user_id: updated.assigned_user_id,
      created_by_user_id: updated.created_by_user_id,
      created_at: new Date(updated.created_at * 1000).toISOString(),
      updated_at: new Date(updated.updated_at * 1000).toISOString(),
    };
  });

  // DELETE /api/issues/:id - Delete an issue
  fastify.delete('/api/issues/:id', {
    preHandler: requireAuth,
  }, async (request, reply) => {
    const { id } = request.params;

    const existing = queryOne('SELECT id FROM issue WHERE id = ?', [id]);
    if (!existing) {
      throw new NotFoundError('Issue not found');
    }

    execute('DELETE FROM issue WHERE id = ?', [id]);
    return { message: 'Issue deleted successfully' };
  });
}
