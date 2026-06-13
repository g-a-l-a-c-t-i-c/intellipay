import { Hono } from 'hono';
import { encrypt, decrypt } from '../lib/crypto';
import { merchantAuth } from '../middleware/auth';

type Env = { DB: D1Database; ENCRYPTION_KEY: string };

interface CustomerBody {
  email: string;
  profile?: Record<string, unknown>;
}

const customers = new Hono<{ Bindings: Env }>();

customers.get('/', merchantAuth, async (c) => {
  const { merchantId } = c.get('merchant');
  const rows = await c.env.DB.prepare(
    'SELECT id, email_enc, gdpr_deleted, created_at FROM customers WHERE merchant_id = ? AND gdpr_deleted = 0'
  ).bind(merchantId).all<{ id: string; email_enc: string; gdpr_deleted: number; created_at: string }>();

  const result = await Promise.all(
    (rows.results ?? []).map(async (row) => ({
      id: row.id,
      email: await decrypt(row.email_enc, c.env.ENCRYPTION_KEY),
      created_at: row.created_at,
    }))
  );
  return c.json({ customers: result });
});

customers.post('/', merchantAuth, async (c) => {
  const { merchantId } = c.get('merchant');
  const body = await c.req.json<CustomerBody>();
  if (!body.email?.includes('@')) return c.json({ error: 'Valid email required' }, 400);

  const id = crypto.randomUUID();
  const emailEnc = await encrypt(body.email, c.env.ENCRYPTION_KEY);
  const profileEnc = body.profile ? await encrypt(JSON.stringify(body.profile), c.env.ENCRYPTION_KEY) : null;
  const now = new Date().toISOString();

  await c.env.DB.prepare(
    'INSERT INTO customers (id, merchant_id, email_enc, profile_enc, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, merchantId, emailEnc, profileEnc, now, now).run();

  return c.json({ id }, 201);
});

customers.get('/:id', merchantAuth, async (c) => {
  const { merchantId } = c.get('merchant');
  const row = await c.env.DB.prepare(
    'SELECT id, email_enc, profile_enc, behavior, created_at FROM customers WHERE id = ? AND merchant_id = ? AND gdpr_deleted = 0'
  ).bind(c.req.param('id'), merchantId).first<{ id: string; email_enc: string; profile_enc: string | null; behavior: string | null; created_at: string }>();

  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json({
    id: row.id,
    email: await decrypt(row.email_enc, c.env.ENCRYPTION_KEY),
    profile: row.profile_enc ? JSON.parse(await decrypt(row.profile_enc, c.env.ENCRYPTION_KEY)) : null,
    behavior: row.behavior ? JSON.parse(row.behavior) : null,
    created_at: row.created_at,
  });
});

customers.put('/:id', merchantAuth, async (c) => {
  const { merchantId } = c.get('merchant');
  const body = await c.req.json<Partial<CustomerBody>>();
  const now = new Date().toISOString();

  const emailEnc = body.email ? await encrypt(body.email, c.env.ENCRYPTION_KEY) : null;
  const profileEnc = body.profile ? await encrypt(JSON.stringify(body.profile), c.env.ENCRYPTION_KEY) : null;

  await c.env.DB.prepare(
    'UPDATE customers SET email_enc = COALESCE(?, email_enc), profile_enc = COALESCE(?, profile_enc), updated_at = ? WHERE id = ? AND merchant_id = ? AND gdpr_deleted = 0'
  ).bind(emailEnc, profileEnc, now, c.req.param('id'), merchantId).run();

  return c.json({ id: c.req.param('id'), updated: true });
});

// GDPR right-to-erasure
customers.delete('/:id', merchantAuth, async (c) => {
  const { merchantId } = c.get('merchant');
  const customerId = c.req.param('id');
  const now = new Date().toISOString();

  const result = await c.env.DB.prepare(
    'UPDATE customers SET gdpr_deleted = 1, email_enc = ?, profile_enc = NULL, behavior = NULL, updated_at = ? WHERE id = ? AND merchant_id = ?'
  ).bind('', now, customerId, merchantId).run();

  if (!result.meta.changes) return c.json({ error: 'Not found' }, 404);

  await c.env.DB.prepare(
    'INSERT INTO audit_log (id, merchant_id, actor_id, action, resource, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(crypto.randomUUID(), merchantId, merchantId, 'GDPR_DELETE', `customer:${customerId}`, null, now).run();

  return new Response(null, { status: 204 });
});

export { customers };
