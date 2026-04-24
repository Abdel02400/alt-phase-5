import { mergeObjects } from './mergeObjects';

describe('mergeObjects', () => {
  it('somme les valeurs des clés communes (cas de l\'énoncé)', () => {
    const a = { january: 1000, february: 1200, march: 900 };
    const b = { january: 800, february: 950, march: 1100 };
    expect(mergeObjects(a, b)).toEqual({
      january: 1800,
      february: 2150,
      march: 2000,
    });
  });

  it('conserve les clés présentes dans un seul objet', () => {
    expect(mergeObjects({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('traite les clés de b non présentes dans a', () => {
    expect(mergeObjects({ a: 10 }, { a: 5, b: 3 })).toEqual({ a: 15, b: 3 });
  });

  it('ne mute pas les objets d\'entrée', () => {
    const a = { x: 1 };
    const b = { x: 2 };
    mergeObjects(a, b);
    expect(a).toEqual({ x: 1 });
    expect(b).toEqual({ x: 2 });
  });
});
