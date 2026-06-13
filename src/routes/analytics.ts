import { Hono } from 'hono';
import { merchantAuth } from '../middleware/auth';

type Env = { DB: D1Database };

const analytics = new Hono<{ Bindings: Env }>();

analytics.get('/dashboard', merchantAuth, async (c) => {
  const { merchantId } = c.get('merchant');

  const [totals, methods] = await Promise.all([
    c.env.DB.prepare(
      `SELECT
         COUNT(*) as total_transactions,
         COALESCE(SUM(amount_cents), 0) as total_revenue_cents,
         ROUND(100.0 * SUM(CASE WHEN status = 'complete' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2) as conversion_rate
       FROM transactions WHERE merchant_id = ?`
    ).bind(merchantId).first<{ total_transactions: number; total_revenue_cents: number; conversion_rate: number | null }>(),

    c.env.DB.prepare(
      `SELECT payment_method, COUNT(*) as count
       FROM transactions WHERE merchant_id = ? AND status = 'complete' AND payment_method IS NOT NULL
       GROUP BY payment_method ORDER BY count DESC LIMIT 5`
    ).bind(merchantId).all<{ payment_method: string; count: number }>(),
  ]);

  return c.json({
    total_transactions: totals?.total_transactions ?? 0,
    total_revenue_cents: totals?.total_revenue_cents ?? 0,
    conversion_rate: totals?.conversion_rate ?? 0,
    top_payment_methods: methods.results ?? [],
  });
});

export { analytics };
