import { getDb } from '../db/connection.js';

export default async function healthRoutes(fastify) {
  // GET /health - Detailed health status
  fastify.get('/health', async (request, reply) => {
    const startTime = Date.now();
    
    let dbStatus = 'connected';
    let dbResponseTime = 0;
    
    try {
      const dbStart = Date.now();
      getDb().prepare('SELECT 1').get();
      dbResponseTime = Date.now() - dbStart;
    } catch (error) {
      dbStatus = 'disconnected';
      console.error('Database health check failed:', error);
    }

    const memUsage = process.memoryUsage();
    
    return {
      status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: (memUsage.heapUsed / 1024 / 1024).toFixed(2),
        total: (memUsage.heapTotal / 1024 / 1024).toFixed(2),
        usage: ((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(1) + '%',
      },
      database: {
        status: dbStatus,
        responseTime: dbResponseTime,
      },
    };
  });

  // GET /health/ready - Readiness probe
  fastify.get('/health/ready', async (request, reply) => {
    try {
      getDb().prepare('SELECT 1').get();
      return { status: 'ready' };
    } catch (error) {
      reply.code(503).send({ status: 'not ready' });
    }
  });

  // GET /health/live - Liveness probe
  fastify.get('/health/live', async (request, reply) => {
    return { status: 'alive' };
  });
}
