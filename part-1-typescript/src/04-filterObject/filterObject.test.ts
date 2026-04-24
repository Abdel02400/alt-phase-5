import { filterObject } from './filterObject';

describe('filterObject', () => {
  it('filtre les éléments en rupture de stock (cas de l\'énoncé)', () => {
    const inventory = { laptop: 0, smartphone: 5, tablet: 0, headphones: 8 };
    expect(filterObject(inventory, (stock) => stock === 0)).toEqual({
      laptop: 0,
      tablet: 0,
    });
  });

  it('retourne un objet vide si aucune valeur ne correspond', () => {
    expect(filterObject({ a: 1, b: 2 }, (v) => v > 10)).toEqual({});
  });

  it('donne accès à la clé dans le prédicat', () => {
    const result = filterObject({ apple: 1, banana: 2, apricot: 3 }, (_, k) =>
      k.startsWith('a'),
    );
    expect(result).toEqual({ apple: 1, apricot: 3 });
  });

  it('ne mute pas l\'objet d\'entrée', () => {
    const obj = { a: 1, b: 2 };
    filterObject(obj, () => false);
    expect(obj).toEqual({ a: 1, b: 2 });
  });
});
