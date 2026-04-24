import { getValues } from './getValues';

describe('getValues', () => {
  it("retourne les valeurs dans l'ordre d'insertion", () => {
    expect(getValues({ level1: 100, level2: 85, level3: 95 })).toEqual([100, 85, 95]);
  });

  it('retourne un tableau vide pour un objet vide', () => {
    expect(getValues({})).toEqual([]);
  });

  it('gère des valeurs de types hétérogènes', () => {
    expect(getValues({ a: 1, b: 'x', c: true })).toEqual([1, 'x', true]);
  });
});
