import pool from './db.js';

const email = process.argv[2];
if (!email || !['127.0.0.1', 'localhost', '::1'].includes(process.env.DB_HOST)) {
  console.error('Usage (local database only): node seedDemo.js user@example.com');
  process.exit(1);
}
const client = await pool.connect();
try {
  await client.query('BEGIN');
  const { rows: [user] } = await client.query('SELECT id FROM users WHERE email = $1', [email]);
  if (!user) throw new Error('Create the account in the app first.');
  const today = new Date();
  const monthAt = (offset) => {
    const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };
  for (let i = 0; i < 6; i++) {
    const month = monthAt(i - 5);
    await client.query(`INSERT INTO incomes (user_id, month, salary, extra) VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, month) DO NOTHING`, [user.id, month, 32000 + i * 500, [1200, 0, 2500, 800, 1500, 600][i]]);
    await client.query(`INSERT INTO monthly_outcomes (user_id, month, avgift_loan, debt, extra) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, month) DO NOTHING`, [user.id, month, 8500, 1200, [3400, 4200, 2900, 5100, 3600, 3100][i]]);
    await client.query(`INSERT INTO account_balances (user_id, month, amount) VALUES ($1, $2, $3)
      ON CONFLICT (user_id, month) DO NOTHING`, [user.id, monthAt(i - 6), 18000 + i * 4200]);
  }
  for (const [description, amount, source] of [
    ['[Demo] Internet', 399, 'bank'], ['[Demo] Spotify', 119, 'revolut'],
    ['[Demo] Insurance', 249, 'bank'], ['[Demo] Gym', 329, 'revolut'],
  ]) {
    await client.query(`INSERT INTO fixed_costs (user_id, description, amount, currency, payment_source)
      SELECT $1::integer, $2::varchar, $3::numeric, 'SEK', $4::varchar WHERE NOT EXISTS
      (SELECT 1 FROM fixed_costs WHERE user_id = $1 AND description = $2)`, [user.id, description, amount, source]);
  }
  await client.query('COMMIT');
  console.log('Demo data added for six months; existing values preserved.');
} catch (error) {
  await client.query('ROLLBACK');
  console.error(error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
