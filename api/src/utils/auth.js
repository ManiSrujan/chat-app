import bcrypt from "bcrypt";
import { createUser, getUser } from "../db/user.js";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../constants.js";

async function signUp(username, firstname, lastname, password) {
  try {
    // check if username already exists
    if ((await getUser(username)).length) {
      throw new Error(ERROR_MESSAGES.UserNameExists);
    }

    // hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // store user in database
    await createUser(username, firstname, lastname, hashedPass);
  } catch (error) {
    throw error;
  }
}

async function verifyPassword(username, password) {
  try {
    // get user from db
    const user = await getUser(username);

    if (!user.length) {
      throw new Error(ERROR_MESSAGES.UserNotFound);
    }

    // compare password with hashed password
    const isCorrectPass = await bcrypt.compare(
      password,
      user[0].hashed_password,
    );

    if (!isCorrectPass) {
      throw new Error(ERROR_MESSAGES.WrongPassword);
    }
    return user[0];
  } catch (error) {
    throw error;
  }
}

async function generateJWTToken(userId, username, password, secret, expiresIn) {
  if (expiresIn) {
    const token = jwt.sign({ userId, username, password }, secret, {
      expiresIn,
    });
    return token;
  }
  const token = jwt.sign({ userId, username, password }, secret);
  return token;
}

async function verifyJWTToken(token, secret) {
  return jwt.verify(token, secret);
}

export { signUp, verifyPassword, generateJWTToken, verifyJWTToken };
