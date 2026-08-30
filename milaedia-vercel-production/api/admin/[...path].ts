import { createHmac, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

type Request = IncomingMessage & {
  body?: unknown;
  query?: Record<string, string | string[]>;
};

type Response = ServerResponse & {
  status?: (code: number) => Response;
  json?: (body: unknown) => void;
};

const COOKIE_NAME = 'milaedia_admin_session';
const SESSION_LIFETIME_SECONDS = 8 * 60 * 60;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error('SESSION_SECRET environment variable is required.');
  return value;
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url');
}

function readCookies(header: string | undefined) {
  return Object.fromEntries(
    (header || '')
      .split(';')
      .map((part) => part.trim().split('='))
      .filter(([key, value]) => key && value)
      .map(([key, ...value]) => [key, value.join('=')]),
  );
}

function currentSession(req: Request) {
  const token = readCookies(req.headers.cookie)[COOKIE_NAME];
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as {
      email?: unknown;
      expiresAt?: unknown;
    };
    if (
      typeof payload.email !== 'string' ||
      typeof payload.expiresAt !== 'number' ||
      payload.expiresAt <= Date.now()
    ) return null;
    return payload;
  } catch {
    return null;
  }
}

function send(res: Response, status: number, body: unknown) {
  if (res.status && res.json) {
    const statusResponse = res.status(status);
    if (statusResponse.json) statusResponse.json(body);
    return;
  }
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function getPath(req: Request) {
  const path = req.query?.path;
  return Array.isArray(path) ? path[0] : path || '';
}

async function getBody(req: Request) {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function setSessionCookie(res: Response, email: string) {
  const payload = Buffer.from(
    JSON.stringify({ email, expiresAt: Date.now() + SESSION_LIFETIME_SECONDS * 1000 }),
  ).toString('base64url');
  const token = `${payload}.${sign(payload)}`;
  const secure = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_LIFETIME_SECONDS}${secure ? '; Secure' : ''}`,
  );
}

export default async function handler(req: Request, res: Response) {
  const action = getPath(req);
  const session = currentSession(req);

  if (req.method === 'GET' && action === 'session') {
    send(res, 200, session
      ? { authenticated: true, user: { email: session.email, role: 'gallery-admin' }, mode: 'production' }
      : { authenticated: false });
    return;
  }

  if (req.method === 'POST' && action === 'login') {
    const body = await getBody(req);
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail || password.length < 8) {
      send(res, 400, { authenticated: false, message: 'Enter a valid email and a password of at least 8 characters.' });
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword || email !== adminEmail || password !== adminPassword) {
      send(res, 401, { authenticated: false, message: 'The email or password is incorrect.' });
      return;
    }

    setSessionCookie(res, email);
    send(res, 200, { authenticated: true, user: { email, role: 'gallery-admin' }, mode: 'production' });
    return;
  }

  if (req.method === 'POST' && action === 'logout') {
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
    send(res, 200, { authenticated: false });
    return;
  }

  send(res, 404, { message: 'Not found' });
}