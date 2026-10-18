/** Arithmetic only: precedence, parentheses, unary signs and decimal comma/dot. */
export function evaluateAmount(input: string): number {
  const source = input.replace(/\s/g, '').replace(/,/g, '.').replace(/×/g, '*').replace(/÷/g, '/');
  if (!source || source.length > 200 || /[^\d.+\-*/()]/.test(source)) return NaN;
  let position = 0;
  function primary(): number {
    if (source[position] === '+' || source[position] === '-') {
      const sign = source[position++] === '-' ? -1 : 1;
      return sign * primary();
    }
    if (source[position] === '(') {
      position++;
      const value = expression();
      if (source[position++] !== ')') throw new Error('parenthesis');
      return value;
    }
    const number = source.slice(position).match(/^(?:\d+(?:\.\d*)?|\.\d+)/)?.[0];
    if (!number) throw new Error('number');
    position += number.length;
    return Number(number);
  }
  function product(): number {
    let value = primary();
    while (source[position] === '*' || source[position] === '/') {
      const operator = source[position++];
      const right = primary();
      if (operator === '/' && right === 0) throw new Error('division by zero');
      value = operator === '*' ? value * right : value / right;
    }
    return value;
  }
  function expression(): number {
    let value = product();
    while (source[position] === '+' || source[position] === '-') {
      const operator = source[position++];
      const right = product();
      value = operator === '+' ? value + right : value - right;
    }
    return value;
  }
  try {
    const value = expression();
    return position === source.length && Number.isFinite(value) ? value : NaN;
  } catch {
    return NaN;
  }
}

export function amountForSave(input: string, errorMessage: string, emptyAsZero = false): number {
  const value = emptyAsZero && !input.trim() ? 0 : evaluateAmount(input);
  if (!Number.isFinite(value) || value < 0) throw new Error(errorMessage);
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
