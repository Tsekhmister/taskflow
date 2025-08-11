import { describe, it, expect } from 'vitest';

describe('App Logic', () => {
  it('should handle basic arithmetic', () => {
    expect(1 + 1).toBe(2);
    expect(2 * 3).toBe(6);
    expect(10 - 5).toBe(5);
  });

  it('should handle string operations', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World');
    expect('TaskFlow'.length).toBe(8);
  });

  it('should handle array operations', () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(numbers.length).toBe(5);
    expect(numbers.reduce((a, b) => a + b, 0)).toBe(15);
  });
});
