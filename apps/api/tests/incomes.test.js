import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import pool from '../db.js';
import { create } from '../features/incomes/incomes.service.js';
import { createIncome } from '../features/incomes/incomes.controller.js';

test('monthly incomes preserve omitted fields and update only supplied values', async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: [user] } = await client.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      [`income-test-${randomUUID()}@budgy.test`, 'test-only'],
    );
    const initial = await create(user.id, { month: '2026-10', salary: 32000 }, client);
    assert.equal(initial.salary, '32000.00');
    assert.equal(initial.extra, '0.00');

    const withExtra = await create(user.id, { month: '2026-10', extra: 284 + 3920 }, client);
    assert.equal(withExtra.id, initial.id);
    assert.equal(withExtra.salary, '32000.00');
    assert.equal(withExtra.extra, '4204.00');
    assert.equal(withExtra.total, '36204.00');

    const repeated = await create(user.id, { month: '2026-10', extra: 4204 }, client);
    assert.equal(repeated.extra, '4204.00');

    const changedSalary = await create(user.id, { month: '2026-10', salary: 35000 }, client);
    assert.equal(changedSalary.extra, '4204.00');
    assert.equal(changedSalary.total, '39204.00');

    const zero = await create(user.id, { month: '2026-10', extra: 0 }, client);
    assert.equal(zero.extra, '0.00');
    assert.equal(zero.salary, '35000.00');
    const onlyExtra = await create(user.id, { month: '2026-11', extra: 500 }, client);
    assert.equal(onlyExtra.salary, '0.00');
    assert.equal(onlyExtra.total, '500.00');

    const { rows: [other] } = await client.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      [`income-test-${randomUUID()}@budgy.test`, 'test-only'],
    );
    const separate = await create(other.id, { month: '2026-10', extra: 42 }, client);
    assert.notEqual(separate.id, initial.id);
    assert.equal(separate.salary, '0.00');
  } finally {
    await client.query('ROLLBACK');
    client.release();
    await pool.end();
  }
});

test('rejects an empty save or invalid amounts before reaching the database', async () => {
  for (const body of [
    { month: '2026-10' },
    { month: '2026-10', extra: null },
    { month: '2026-10', extra: '284+3920' },
    { month: '2026-10', extra: -1 },
    { month: '2026-10', extra: Infinity },
  ]) {
    let status;
    const response = { status(code) { status = code; return this; }, json() {} };
    await createIncome({ body, user: { userId: -1 } }, response);
    assert.equal(status, 400);
  }
});
