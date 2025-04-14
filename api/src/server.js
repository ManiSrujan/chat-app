import express from "express";
import { getAllUsers } from "./db/user.js";
import dotenv from "dotenv";
import { getErrorMessage } from "./utils.js";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/users", async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send({ message: getErrorMessage(error) });
  }
});

app.listen(process.env.API_PORT);
