import { query, queryOne, execute } from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';
import { validateTag } from '../utils/validation.js';
import { NotFoundError, ConflictError } from '../middleware/error.js';

export default async function tagsRoutes(fastify) {
  // GET /api/tags - List all tags
  fastify.get('/api/tags', async (request, reply) => {
    const tags = query(
      'SELECT id, name, color FROM tag ORDER BY name ASC'
    );
    return tags;
  });

  // POST /api/tags - Create a new tag
  fastify.post('/api/tags', {
    preHandler: requireAuth,
  }, async (request, reply) => {
    const data = request.body;
    validateTag(data);

    // Check for duplicate name (case-insensitive)
    const existing = queryOne(
      'SELECT id FROM tag WHERE LOWER(name) = LOWER(?)',
      [data.name]
    );

    if (existing) {
      throw new ConflictError('Tag with this name already exists');
    }

    const result = execute(
      'INSERT INTO tag (name, color) VALUES (?, ?)',
      [data.name, data.color]
    );

    const tag = queryOne('SELECT * FROM tag WHERE id = ?', [result.lastInsertRowid]);
    reply.code(201).send(tag);
  });

  // DELETE /api/tags/:id - Delete a tag
  fastify.delete('/api/tags/:id', {
    preHandler: requireAuth,
  }, async (request, reply) => {
    const { id } = request.params;

    // Check if tag exists
    const tag = queryOne('SELECT id FROM tag WHERE id = ?', [id]);
    if (!tag) {
      throw new NotFoundError('Tag not found');
    }

    // Check if tag is in use
    const inUse = queryOne(
      'SELECT COUNT(*) as count FROM issue_tag WHERE tag_id = ?',
      [id]
    );

    if (inUse.count > 0) {
      throw new ConflictError('Cannot delete tag that is assigned to issues');
    }

    execute('DELETE FROM tag WHERE id = ?', [id]);
    return { message: 'Tag deleted successfully' };
  });
}
