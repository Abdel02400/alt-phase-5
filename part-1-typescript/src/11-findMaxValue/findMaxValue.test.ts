import { findMaxValue } from './findMaxValue';

describe('findMaxValue', () => {
  it('trouve le maximum (cas de l\'énoncé)', () => {
    const scores = { level1: 850, level2: 920, level3: 880, level4: 1020 };
    expect(findMaxValue(scores)).toBe(1020);
  });

  it('fonctionne avec un seul élément', () => {
    expect(findMaxValue({ a: 42 })).toBe(42);
  });

  it('supporte les nombres négatifs', () => {
    expect(findMaxValue({ a: -10, b: -5, c: -20 })).toBe(-5);
  });

  it('retourne -Infinity sur un objet vide (comportement JS natif)', () => {
    expect(findMaxValue({})).toBe(-Infinity);
  });
});
