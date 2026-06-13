import { Hono } from 'hono';
import { generateApiKey, hashApiKey } from '../lib/crypto';
import { merchantAuth } from '../middleware/auth';

type Env = { DB: D1Database; JWT_SECRET: string; ENCRYPTION_KEY: string };

const merchants = new Hono<{ Bindings: Env }>();

merchants.post('/', async (c) => {
  const body = await c.req.json<{ name?: string }>();
  if (!body.name?.trim()) {
    return c.json({ error: 'name is required' }, 400);
  }

  const id = crypto.randomUUID();
  const rawKey = generateApiKey();
  const keyHash = await hashApiKey(rawKey);
  const now = new Date().toISOString();

  await c.env.DB.prepare(
    'INSERT INTO merchants (id, name, api_key, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, body.name.trim(), keyHash, now, now).run();

  return c.json({ id, name: body.name.trim(), api_key: rawKey }, 201);
});

merchants.get('/:id', merchantAuth, async (c) => {
  const { merchantId } = c.get('merchant');
  const id = c.req.param('id');
  if (id !== merchantId) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const row = await c.env.DB.prepare(
    'SELECT id, name, plan_tier, status, settings, created_at FROM merchants WHERE id = ?'
  ).bind(id).first<{ id: string; name: string; plan_tier: string; status: string; settings: string | null; created_at: string }>();

  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

merchants.put('/:id', merchantAuth, async (c) => {
  const { merchantId } = c.get('merchant');
  const id = c.req.param('id');
  if (id !== merchantId) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const body = await c.req.json<{ name?: string; settings?: Record<string, unknown> }>();
  const now = new Date().toISOString();

  await c.env.DB.prepare(
    'UPDATE merchants SET name = COALESCE(?, name), settings = COALESCE(?, settings), updated_at = ? WHERE id = ?'
  ).bind(body.name ?? null, body.settings ? JSON.stringify(body.settings) : null, now, id).run();

  return c.json({ id, updated: true });
});

export { merchants };
