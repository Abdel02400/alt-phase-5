import { compareDifferences } from './compareDifferences';

/**
 * Cas d'usage : Suivi des modifications d'un profil utilisateur
 */
export function run(): void {
  const oldProfile = {
    name: 'Jean Dupont',
    email: 'jean@email.com',
    age: 30,
  };

  const newProfile = {
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    age: 31,
    phone: '0123456789',
  };

  console.log(compareDifferences(oldProfile, newProfile));
  // {
  //   email: { type: "modified", old: "jean@email.com", new: "jean.dupont@email.com" },
  //   age:   { type: "modified", old: 30, new: 31 },
  //   phone: { type: "added", new: "0123456789" }
  // }
}
