import Fastify from 'fastify';
import cors from '@fastify/cors';
import { auth } from './auth.js';
import { errorHandler } from './middleware/error.js';
import issuesRoutes from './routes/issues.js';
import tagsRoutes from './routes/tags.js';
import usersRoutes from './routes/users.js';
import healthRoutes from './routes/health.js';

const fastify = Fastify({
  logger: true,
});

// CORS configuration
await fastify.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
});

// Register error handler
fastify.setErrorHandler(errorHandler);

// BetterAuth routes
fastify.all('/api/auth/*', async (request, reply) => {
  const response = await auth.handler(
    new Request(
      new URL(request.url, `http://${request.headers.host}`),
      {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? JSON.stringify(request.body) : undefined,
      }
    )
  );
  
  // Copy response headers
  response.headers.forEach((value, key) => {
    reply.header(key, value);
  });
  
  // Set status and send body
  reply.code(response.status);
  
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return reply.send(await response.json());
  } else {
    return reply.send(await response.text());
  }
});

// Register API routes
await fastify.register(issuesRoutes);
await fastify.register(tagsRoutes);
await fastify.register(usersRoutes);
await fastify.register(healthRoutes);

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
