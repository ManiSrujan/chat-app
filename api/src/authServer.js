import express from "express";
import { signUp, verifyPassword } from "./authentication.js";
import dotenv from "dotenv";
import { getErrorMessage } from "./utils.js";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/users/login", async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    // verify username and password
    await verifyPassword(username, password);

    // TODO: create a jwt token and return it
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ message: getErrorMessage(error) });
  }
});

app.post("/users/signup", async function signUpUser(req, res) {
  try {
    const { username, firstname, lastname, password } = req.body;

    await signUp(username, firstname, lastname, password);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: getErrorMessage(error) });
  }
});

app.listen(process.env.AUTH_PORT);
