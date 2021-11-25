import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

const createSalt = async function () {
  const salt = await crypto.randomBytes(64).toString('base64');

  return salt;
};

// const createHashedPassword = async function (password) {
//   const salt = await createSalt();

//   console.log(salt);

//   const hashedPassword = await crypto
//     .pbkdf2(password, salt, 9999, 64, "sha512")
//     .toString("base64");

//   return [salt, hashedPassword];
// };

export const createHashedPassword = async (plainPassword: string) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return err;
    bcrypt.hash(plainPassword, salt, (err, hashedPassword) => {
      if (err) return err;
      return { hashedPassword, salt };
    });
  });
};

// export const createHashedPassword = async (plainPassword: string) =>
//   new Promise(async (resolve, reject) => {
//     const salt = await createSalt();

//     crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
//       if (err) reject(err);

//       resolve({ hashedPassword: key.toString('base64'), salt });
//     });
//   });

export const makePasswordHashed = (salt: string, plainPassword: string) =>
  new Promise(async (resolve, reject) => {
    crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
      if (err) reject(err);

      resolve(key.toString('base64'));
    });
  });
