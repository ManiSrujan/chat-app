import express from "express";
import {
  generateJWTToken,
  signUp,
  verifyJWTToken,
  verifyPassword,
} from "./auth/index.js";
import dotenv from "dotenv";
import { getErrorMessage } from "./utils.js";
import { addTokenToDb, isTokenInDb } from "./db/refreshToken.js";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/auth/login", async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    // verify username and password
    await verifyPassword(username, password);

    const [accessToken, refreshToken] = await Promise.all([
      generateJWTToken(
        username,
        password,
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_EXPIRE,
      ),
      generateJWTToken(
        username,
        password,
        process.env.REFRESH_TOKEN_SECRET,
        process.env.REFRESH_TOKEN_EXPIRE,
      ),
    ]);

    // Add refresh token to db
    await addTokenToDb(refreshToken);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).send({ message: getErrorMessage(error) });
  }
});

app.post("/auth/signup", async function signUpUser(req, res) {
  try {
    const { username, firstname, lastname, password } = req.body;

    await signUp(username, firstname, lastname, password);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: getErrorMessage(error) });
  }
});

app.post("/auth/refresh", async function refreshUserToken(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!(await isTokenInDb(refreshToken))) {
      throw new Error();
    }

    const data = await verifyJWTToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const { username, password } = data;
    const newAccessToken = await generateJWTToken(
      username,
      password,
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRE,
    );
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.sendStatus(403);
  }
});

app.listen(process.env.AUTH_PORT);
