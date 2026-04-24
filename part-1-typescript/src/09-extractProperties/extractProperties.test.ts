import { extractProperties } from './extractProperties';

describe('extractProperties', () => {
  it('extrait uniquement les clés demandées (cas de l\'énoncé)', () => {
    const profile = {
      name: 'Jean Martin',
      email: 'jean@email.com',
      password: 'secret123',
      age: 35,
      address: '123 rue Principal',
    };
    expect(extractProperties(profile, ['name', 'age'])).toEqual({
      name: 'Jean Martin',
      age: 35,
    });
  });

  it('retourne un objet vide si aucune clé n\'est demandée', () => {
    expect(extractProperties({ a: 1, b: 2 }, [])).toEqual({});
  });

  it('préserve l\'ordre des clés demandées', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(Object.keys(extractProperties(obj, ['c', 'a']))).toEqual(['c', 'a']);
  });

  it('ne mute pas l\'objet source', () => {
    const obj = { a: 1, b: 2 };
    extractProperties(obj, ['a']);
    expect(obj).toEqual({ a: 1, b: 2 });
  });
});
