import express from "express";
import { getAllUsers } from "./db/user.js";
import { signUp, verifyPassword } from "./authentication.js";

const app = express();
app.use(express.json());

function getErrorMessage(error) {
  return error.message ?? "unknown error";
}

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

app.get("/users", async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send({ message: getErrorMessage(error) });
  }
});

app.listen(process.env.API_PORT);
