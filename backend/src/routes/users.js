import { query } from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';

export default async function usersRoutes(fastify) {
  // GET /api/users - List all users
  fastify.get('/api/users', {
    preHandler: requireAuth,
  }, async (request, reply) => {
    const users = query(
      'SELECT id, name, email FROM user ORDER BY name ASC'
    );
    return users;
  });
}
