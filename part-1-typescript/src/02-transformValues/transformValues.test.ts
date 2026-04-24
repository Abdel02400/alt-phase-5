import { transformValues } from './transformValues';

describe('transformValues', () => {
  it('convertit des euros en dollars (cas de l\'énoncé)', () => {
    const prices = { book: 20, pen: 5, notebook: 10 };
    const toDollars = (euros: number): number => euros * 1.1;
    const result = transformValues(prices, toDollars);
    expect(result.book).toBeCloseTo(22);
    expect(result.pen).toBeCloseTo(5.5);
    expect(result.notebook).toBeCloseTo(11);
  });

  it('fournit la clé en second argument au callback', () => {
    const result = transformValues({ a: 1, b: 2 }, (v, k) => `${k}=${v}`);
    expect(result).toEqual({ a: 'a=1', b: 'b=2' });
  });

  it('peut changer le type des valeurs', () => {
    const result = transformValues({ a: 1, b: 2, c: 3 }, (v) => v > 1);
    expect(result).toEqual({ a: false, b: true, c: true });
  });

  it('retourne un objet vide pour un objet vide', () => {
    expect(transformValues({}, (v) => v)).toEqual({});
  });
});
