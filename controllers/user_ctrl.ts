import * as bcrypt from 'bcrypt';

export const createHashedPassword = async (plainPassword: string) => {
  const salt = await bcrypt
    .genSalt(10)
    .then(salt => salt)
    .catch(err => err.message);

  const hashedPassword = await bcrypt
    .hash(plainPassword, salt)
    .then(hashedPassword => hashedPassword)
    .catch(err => err.message);

  return hashedPassword;
};

export const checkPassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  const check = await bcrypt
    .compare(plainPassword, hashedPassword)
    .then(check => check)
    .catch(err => err.message);

  return check;
};
