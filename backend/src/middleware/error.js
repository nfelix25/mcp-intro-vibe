export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

export function errorHandler(error, request, reply) {
  // Handle known error types
  if (error.statusCode) {
    return reply.code(error.statusCode).send({
      error: error.message,
    });
  }

  // Handle SQLite errors
  if (error.code) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return reply.code(409).send({
        error: 'Resource already exists',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      return reply.code(400).send({
        error: 'Invalid reference to related resource',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);

  // Generic error response
  return reply.code(500).send({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
}
