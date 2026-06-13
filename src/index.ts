import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { merchants } from './routes/merchants';
import { checkout } from './routes/checkout';
import { customers } from './routes/customers';
import { analytics } from './routes/analytics';

type Env = {
  DB: D1Database;
  SESSIONS: KVNamespace;
  AI: Ai;
  JWT_SECRET: string;
  ENCRYPTION_KEY: string;
  ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));

app.get('/health', (c) => c.json({ status: 'ok', version: '0.1.0' }));

app.route('/api/merchants', merchants);
app.route('/api/checkout', checkout);
app.route('/api/customers', customers);
app.route('/api/analytics', analytics);

app.notFound((c) => c.json({ error: 'Not found' }, 404));
app.onError((err, c) => {
  console.error('[intellipay error]', err.message, err.stack);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
