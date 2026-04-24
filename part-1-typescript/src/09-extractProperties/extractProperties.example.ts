import { extractProperties } from './extractProperties';

/**
 * Cas d'usage : Extraction des informations publiques d'un profil
 */
export function run(): void {
  const userProfile = {
    name: 'Jean Martin',
    email: 'jean@email.com',
    password: 'secret123',
    age: 35,
    address: '123 rue Principal',
  };

  const publicInfo = ['name', 'age'] as const;

  console.log(extractProperties(userProfile, publicInfo));
  // { name: "Jean Martin", age: 35 }
}
