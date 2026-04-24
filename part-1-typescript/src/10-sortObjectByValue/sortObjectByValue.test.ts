import { sortObjectByValue } from './sortObjectByValue';

describe('sortObjectByValue', () => {
  it('trie par valeur croissante par défaut (cas de l\'énoncé)', () => {
    const scores = { Alice: 85, Bob: 92, Charlie: 78, David: 95 };
    expect(Object.entries(sortObjectByValue(scores))).toEqual([
      ['Charlie', 78],
      ['Alice', 85],
      ['Bob', 92],
      ['David', 95],
    ]);
  });

  it('trie par valeur décroissante si direction=desc', () => {
    const scores = { a: 1, b: 3, c: 2 };
    expect(Object.entries(sortObjectByValue(scores, 'desc'))).toEqual([
      ['b', 3],
      ['c', 2],
      ['a', 1],
    ]);
  });

  it('fonctionne avec des chaînes', () => {
    const fruits = { x: 'banana', y: 'apple', z: 'cherry' };
    expect(Object.keys(sortObjectByValue(fruits))).toEqual(['y', 'x', 'z']);
  });

  it('retourne un objet vide pour une entrée vide', () => {
    expect(sortObjectByValue({})).toEqual({});
  });

  it('ne mute pas l\'objet d\'entrée', () => {
    const obj = { a: 3, b: 1, c: 2 };
    sortObjectByValue(obj);
    expect(Object.entries(obj)).toEqual([
      ['a', 3],
      ['b', 1],
      ['c', 2],
    ]);
  });
});
