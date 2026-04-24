import { compareDifferences } from './compareDifferences';

describe('compareDifferences', () => {
  it('détecte modifications et ajouts (cas de l\'énoncé)', () => {
    const oldP = {
      name: 'Jean Dupont',
      email: 'jean@email.com',
      age: 30,
    };
    const newP = {
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      age: 31,
      phone: '0123456789',
    };
    expect(compareDifferences(oldP, newP)).toEqual({
      email: {
        type: 'modified',
        old: 'jean@email.com',
        new: 'jean.dupont@email.com',
      },
      age: { type: 'modified', old: 30, new: 31 },
      phone: { type: 'added', new: '0123456789' },
    });
  });

  it('détecte les suppressions', () => {
    expect(compareDifferences({ a: 1, b: 2 }, { a: 1 })).toEqual({
      b: { type: 'removed', old: 2 },
    });
  });

  it('retourne un objet vide si rien ne change', () => {
    expect(compareDifferences({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toEqual({});
  });

  it('gère deux objets vides', () => {
    expect(compareDifferences({}, {})).toEqual({});
  });

  it('combine ajouts, suppressions et modifications', () => {
    expect(compareDifferences({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({
      a: { type: 'removed', old: 1 },
      b: { type: 'modified', old: 2, new: 3 },
      c: { type: 'added', new: 4 },
    });
  });
});
