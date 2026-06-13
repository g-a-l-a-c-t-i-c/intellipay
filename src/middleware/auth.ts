import type { Context, Next } from 'hono';
import { hashApiKey } from '../lib/crypto';

export interface MerchantContext {
  merchantId: string;
  planTier: string;
}

declare module 'hono' {
  interface ContextVariableMap {
    merchant: MerchantContext;
  }
}

export async function merchantAuth(c: Context, next: Next): Promise<Response | void> {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid Authorization header' }, 401);
  }
  const rawKey = authHeader.slice(7);
  const keyHash = await hashApiKey(rawKey);

  const env = c.env as { DB: D1Database };
  const merchant = await env.DB.prepare(
    'SELECT id, plan_tier FROM merchants WHERE api_key = ? AND status = ?'
  ).bind(keyHash, 'active').first<{ id: string; plan_tier: string }>();

  if (!merchant) {
    return c.json({ error: 'Invalid API key' }, 401);
  }

  c.set('merchant', { merchantId: merchant.id, planTier: merchant.plan_tier });
  await next();
}
