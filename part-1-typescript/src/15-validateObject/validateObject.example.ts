import { validateObject, type Schema } from './validateObject';

/**
 * Cas d'usage : Validation d'un formulaire utilisateur
 */
export function run(): void {
  const userSchema: Schema = {
    name: 'string',
    age: 'number',
    email: 'string',
  };

  const userInput = {
    name: 'Marie',
    age: 25,
    email: 'marie@email.com',
  };

  console.log(validateObject(userInput, userSchema)); // true
}
