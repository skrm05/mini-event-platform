import bcrypt from "bcrypt";

const saltRound = 10;

export function generatehash(password) {
  try {
    return bcrypt.hashSync(password, saltRound);
  } catch (error) {
    throw new Error(error.message);
  }
}

export function comparePassword(plainPassword, hashPassword) {
  try {
    return bcrypt.compareSync(plainPassword, hashPassword);
  } catch (error) {
    throw new Error(error.message);
  }
}
