import { findKeysByValue } from './findKeysByValue';

describe('findKeysByValue', () => {
  it('trouve les clés pour une valeur donnée (cas de l\'énoncé)', () => {
    const stock = { laptop: 0, mouse: 5, keyboard: 0, monitor: 3 };
    expect(findKeysByValue(stock, 0)).toEqual(['laptop', 'keyboard']);
  });

  it('retourne un tableau vide si aucune correspondance', () => {
    expect(findKeysByValue({ a: 1, b: 2 }, 99)).toEqual([]);
  });

  it('fonctionne avec des chaînes', () => {
    const statuses = { a: 'ok', b: 'fail', c: 'ok' };
    expect(findKeysByValue(statuses, 'ok')).toEqual(['a', 'c']);
  });

  it('retourne un tableau vide sur un objet vide', () => {
    expect(findKeysByValue({}, 0)).toEqual([]);
  });
});
