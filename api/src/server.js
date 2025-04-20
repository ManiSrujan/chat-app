import express from "express";
import { getAllUsers } from "./db/user.js";
import dotenv from "dotenv";
import { getErrorMessage } from "./utils/utils.js";
import { verifyJWTToken } from "./utils/auth.js";

dotenv.config();
const app = express();
app.use(express.json());

async function verifyToken(req, res, next) {
  try {
    const { authorization } = req.headers;
    const accessToken = authorization.split(" ")[1];

    if (!accessToken) {
      res.sendStatus(401);
    }

    await verifyJWTToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {
    res.sendStatus(403);
  }
}

app.get("/users", verifyToken, async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send({ message: getErrorMessage(error) });
  }
});

app.listen(process.env.API_PORT);
