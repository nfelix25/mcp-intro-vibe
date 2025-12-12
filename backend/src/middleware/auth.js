import { auth } from '../auth.js';

export async function requireAuth(request, reply) {
  // Create a proper Request object for BetterAuth
  const webRequest = new Request(
    new URL(request.url, `http://${request.headers.host}`),
    {
      method: request.method,
      headers: request.headers,
    }
  );

  const session = await auth.api.getSession({
    headers: webRequest.headers,
  });

  if (!session) {
    reply.code(401).send({ error: 'Authentication required' });
    return;
  }

  // Attach user to request for downstream handlers
  request.user = session.user;
  request.session = session.session;
}
