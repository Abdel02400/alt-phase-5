import { createObjectFromArrays } from './createObjectFromArrays';

describe('createObjectFromArrays', () => {
  it('crée un objet depuis deux tableaux alignés (cas de l\'énoncé)', () => {
    const names = ['Alice', 'Bob', 'Charlie'];
    const scores = [100, 85, 90];
    expect(createObjectFromArrays(names, scores)).toEqual({
      Alice: 100,
      Bob: 85,
      Charlie: 90,
    });
  });

  it('tronque au plus court si les longueurs diffèrent (keys plus long)', () => {
    expect(createObjectFromArrays(['a', 'b', 'c'], [1])).toEqual({ a: 1 });
  });

  it('tronque au plus court si les longueurs diffèrent (values plus long)', () => {
    expect(createObjectFromArrays(['a'], [1, 2, 3])).toEqual({ a: 1 });
  });

  it('retourne un objet vide si un tableau est vide', () => {
    expect(createObjectFromArrays([], [1, 2])).toEqual({});
    expect(createObjectFromArrays(['a'], [])).toEqual({});
  });

  it('les doublons dans les clés écrasent (dernière occurrence gagne)', () => {
    expect(createObjectFromArrays(['a', 'a'], [1, 2])).toEqual({ a: 2 });
  });
});
