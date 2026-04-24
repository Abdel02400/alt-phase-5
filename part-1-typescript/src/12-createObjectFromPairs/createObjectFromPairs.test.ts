import { createObjectFromPairs } from './createObjectFromPairs';

describe('createObjectFromPairs', () => {
  it('crée un objet depuis des paires (cas de l\'énoncé)', () => {
    const pairs: Array<[string, number]> = [
      ['pommes', 2.5],
      ['bananes', 1.8],
      ['oranges', 2.2],
    ];
    expect(createObjectFromPairs(pairs)).toEqual({
      pommes: 2.5,
      bananes: 1.8,
      oranges: 2.2,
    });
  });

  it('retourne un objet vide pour un tableau vide', () => {
    expect(createObjectFromPairs([])).toEqual({});
  });

  it('gère les doublons (dernière occurrence gagne)', () => {
    expect(
      createObjectFromPairs([
        ['a', 1],
        ['a', 2],
      ]),
    ).toEqual({ a: 2 });
  });

  it('conserve le type générique des valeurs', () => {
    const result = createObjectFromPairs<string>([
      ['fr', 'bonjour'],
      ['en', 'hello'],
    ]);
    expect(result.fr).toBe('bonjour');
    expect(result.en).toBe('hello');
  });
});
