import { validateObject, type Schema } from './validateObject';

describe('validateObject', () => {
  const userSchema: Schema = {
    name: 'string',
    age: 'number',
    email: 'string',
  };

  it('valide un objet conforme (cas de l\'énoncé)', () => {
    const input = { name: 'Marie', age: 25, email: 'marie@email.com' };
    expect(validateObject(input, userSchema)).toBe(true);
  });

  it('rejette un champ manquant', () => {
    expect(validateObject({ name: 'Marie', age: 25 }, userSchema)).toBe(false);
  });

  it('rejette un mauvais type', () => {
    expect(
      validateObject({ name: 'Marie', age: '25', email: 'x@y.z' }, userSchema),
    ).toBe(false);
  });

  it('accepte des propriétés supplémentaires non listées', () => {
    const input = { name: 'Marie', age: 25, email: 'x@y.z', extra: 42 };
    expect(validateObject(input, userSchema)).toBe(true);
  });

  it('distingue object et array', () => {
    const schema: Schema = { data: 'object' };
    expect(validateObject({ data: {} }, schema)).toBe(true);
    expect(validateObject({ data: [] }, schema)).toBe(false);
    expect(validateObject({ data: null }, schema)).toBe(false);
  });

  it('valide les tableaux', () => {
    const schema: Schema = { tags: 'array' };
    expect(validateObject({ tags: ['a', 'b'] }, schema)).toBe(true);
    expect(validateObject({ tags: {} }, schema)).toBe(false);
  });
});
