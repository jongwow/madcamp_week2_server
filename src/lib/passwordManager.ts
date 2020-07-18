import * as crypto from "crypto-js";

const generateRandomString = (length: number) =>
  crypto.lib.WordArray.random(Math.ceil(length / 2))
    .toString(crypto.enc.Hex)
    .slice(0, length);

const sha512 = (password: string, salt: string) => {
  const hash = crypto.HmacSHA512(password, salt);
  const value = hash.toString(crypto.enc.Hex);
  return {
    salt: salt,
    passwordHash: value,
  };
};

export const saltHashPassword = (userPassword) => {
  const salt = generateRandomString(16); //create 16 random character
  const passwordData = sha512(userPassword, salt);
  return passwordData;
};

export const checkHashPassword = (userPassword, salt) => {
  const passwordData = sha512(userPassword, salt);
  return passwordData;
};
