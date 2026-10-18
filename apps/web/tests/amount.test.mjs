import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAmount, amountForSave } from '../src/utils/amount.ts';

test('single amounts, decimal separators and arithmetic precedence', () => {
  for (const [input, expected] of [
    ['535', 535], ['535*3', 1605], ['1 + 2 * 3', 7], ['(1+2)*3', 9],
    ['10,5+2.25', 12.75], ['-5+10', 5], ['3*-2+8', 2], ['12÷3', 4], ['5×3', 15],
  ]) assert.equal(evaluateAmount(input), expected, input);
});
test('rejects incomplete operations, invalid characters and division by zero', () => {
  for (const input of ['', '535*', '1/0', '1/(2-2)', '1+Infinity', 'Math.random()', '1;2', '(1+2', '1+2)', '2**3', '1.2.3', '2(3)', '9'.repeat(201)]) {
    assert.ok(Number.isNaN(evaluateAmount(input)), input);
  }
});
test('saving uses the result, rounds to cents and rejects negative/invalid results', () => {
  assert.equal(amountForSave('535*3', 'Invalid'), 1605);
  assert.equal(amountForSave('0.1+0.2', 'Invalid'), 0.3);
  assert.equal(amountForSave('', 'Invalid', true), 0);
  assert.equal(amountForSave('0', 'Invalid'), 0);
  for (const input of ['1-2', '535*', '', '1/0']) assert.throws(() => amountForSave(input, 'Invalid'), /Invalid/);
});
