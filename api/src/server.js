import express from "express";
import { getAllUsers } from "./db/user.js";
import dotenv from "dotenv";
import { getErrorMessage } from "./utils/utils.js";
import { verifyJWTToken } from "./utils/auth.js";
import { createChat, deleteChat, getChats } from "./db/chat.js";
import { ERROR_MESSAGES } from "./constants.js";

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

app.post("/chat", verifyToken, async function handleCreateChat(req, res) {
  try {
    const { srcUser, targetUser } = req.body;
    const chatId = await createChat(srcUser, targetUser);
    res.status(201).send({ chatId });
  } catch (error) {
    res.status(500).send({ message: getErrorMessage(error) });
  }
});

app.delete("/chat/:id", verifyToken, async function handleChatDelete(req, res) {
  try {
    const { id } = req.params;
    await deleteChat(id);
    res.sendStatus(200);
  } catch (error) {
    res
      .status(error.message === ERROR_MESSAGES.ChatDoesntExist ? 404 : 500)
      .send({ message: getErrorMessage(error) });
  }
});

app.get("/chat/user/:id", verifyToken, async function handleGetChats(req, res) {
  try {
    const { id } = req.params;
    const chats = await getChats(id);
    res.status(200).send({ chats });
  } catch (error) {
    res.status(500).send({ message: getErrorMessage(error) });
  }
});

app.listen(process.env.API_PORT);
