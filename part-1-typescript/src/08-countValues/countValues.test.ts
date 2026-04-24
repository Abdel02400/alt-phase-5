import { countValues } from './countValues';

describe('countValues', () => {
  it('compte les occurrences des statuts (cas de l\'énoncé)', () => {
    const statuses = {
      order1: 'pending',
      order2: 'delivered',
      order3: 'pending',
      order4: 'cancelled',
      order5: 'pending',
    };
    expect(countValues(statuses)).toEqual({
      pending: 3,
      delivered: 1,
      cancelled: 1,
    });
  });

  it('fonctionne avec des valeurs numériques', () => {
    expect(countValues({ a: 1, b: 2, c: 1, d: 1 })).toEqual({
      '1': 3,
      '2': 1,
    });
  });

  it('retourne un objet vide pour un objet vide', () => {
    expect(countValues({})).toEqual({});
  });

  it('donne 1 pour chaque valeur unique', () => {
    expect(countValues({ a: 'x', b: 'y', c: 'z' })).toEqual({
      x: 1,
      y: 1,
      z: 1,
    });
  });
});
