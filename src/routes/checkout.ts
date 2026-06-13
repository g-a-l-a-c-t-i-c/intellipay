import { Hono } from 'hono';
import { merchantAuth } from '../middleware/auth';

type Env = { DB: D1Database; SESSIONS: KVNamespace; AI: Ai };

interface CheckoutSessionBody {
  cart_items?: Array<{ id: string; amount_cents: number; name: string }>;
  customer_id?: string;
}

interface CompleteBody {
  session_id: string;
  payment_method: string;
  amount_cents: number;
  currency?: string;
  stripe_id?: string;
}

const checkout = new Hono<{ Bindings: Env }>();

checkout.post('/sessions', merchantAuth, async (c) => {
  const { merchantId } = c.get('merchant');
  const body = await c.req.json<CheckoutSessionBody>();
  const sessionId = crypto.randomUUID();

  // Workers AI: get checkout optimization hints (field ordering, payment priority)
  let optimizationConfig: Record<string, unknown> = { payment_order: ['card', 'apple_pay', 'google_pay'] };
  try {
    const aiResult = await (c.env.AI as { run: (model: string, input: unknown) => Promise<{ response?: string }> }).run(
      '@cf/meta/llama-3-8b-instruct',
      {
        prompt: `For a merchant checkout with ${body.cart_items?.length ?? 0} items, suggest optimal form field order and top payment method. Reply as JSON with keys payment_order (array) and field_order (array).`,
        max_tokens: 128,
      }
    );
    if (aiResult?.response) {
      const parsed = JSON.parse(aiResult.response) as Record<string, unknown>;
      optimizationConfig = { ...optimizationConfig, ...parsed };
    }
  } catch {
    // AI inference failed — continue with static defaults (intentional degraded path)
  }

  const session = {
    id: sessionId,
    merchant_id: merchantId,
    customer_id: body.customer_id ?? null,
    cart_items: body.cart_items ?? [],
    optimization_config: optimizationConfig,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  await c.env.SESSIONS.put(`session:${sessionId}`, JSON.stringify(session), { expirationTtl: 7200 });
  return c.json({ session_id: sessionId, optimization_config: optimizationConfig }, 201);
});

checkout.post('/complete', merchantAuth, async (c) => {
  const { merchantId } = c.get('merchant');
  const body = await c.req.json<CompleteBody>();

  if (!body.session_id) return c.json({ error: 'session_id is required' }, 400);
  if (!body.amount_cents || body.amount_cents <= 0) return c.json({ error: 'amount_cents must be positive' }, 400);

  const raw = await c.env.SESSIONS.get(`session:${body.session_id}`);
  if (!raw) return c.json({ error: 'Session not found or expired' }, 404);

  const session = JSON.parse(raw) as { merchant_id: string };
  if (session.merchant_id !== merchantId) return c.json({ error: 'Forbidden' }, 403);

  const txId = crypto.randomUUID();
  const now = new Date().toISOString();

  await c.env.DB.prepare(
    'INSERT INTO transactions (id, merchant_id, customer_id, amount_cents, currency, status, stripe_id, payment_method, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    txId, merchantId, null, body.amount_cents,
    body.currency ?? 'USD', 'complete',
    body.stripe_id ?? null, body.payment_method ?? null, now
  ).run();

  await c.env.SESSIONS.delete(`session:${body.session_id}`);
  return c.json({ transaction_id: txId, status: 'complete' });
});

export { checkout };
