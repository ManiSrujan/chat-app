import express from "express";
import { getAllUsers, getUserById } from "./db/user.js";
import dotenv from "dotenv";
import { getErrorMessage } from "./utils/utils.js";
import { verifyJWTToken } from "./utils/auth.js";
import http from "http";
import websocket from "websocket";
import { createChat, deleteChat, getChats, getUsersOfChat } from "./db/chat.js";
import { ERROR_MESSAGES } from "./constants.js";
import {
  createMessage,
  deleteMessage,
  getAllMessage,
  updateMessage,
} from "./db/message.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.WEBSOCKET_ALLOWED_ORIGIN,
  }),
);

const server = http.createServer(app);
const WebSocketServer = websocket.server;
const wsServer = new WebSocketServer({
  httpServer: server,
});
const webSocketConnections = {};

wsServer.on("request", function handleWSRequest(request) {
  if (request.origin !== process.env.WEBSOCKET_ALLOWED_ORIGIN) {
    console.log("Origin not allowed:", request.origin);
    request.reject(403, "Origin not allowed");
    return;
  }

  const connection = request.accept("chat", request.origin);

  connection.on("close", function handleClose(reasonCode, description) {
    console.log("Client has disconnected:", reasonCode, description);
    Object.keys(webSocketConnections).forEach((userId) => {
      if (!webSocketConnections[userId].connected) {
        delete webSocketConnections[userId];
      }
    });
  });

  connection.on("message", async function handleMessage(message) {
    if (message.type === "utf8") {
      const parsedMessage = JSON.parse(message.utf8Data);
      const { type, data } = parsedMessage;

      switch (type) {
        case "connect":
          webSocketConnections[data["userId"]] = connection;
          break;
        case "disconnect":
          delete webSocketConnections[data["userId"]];
          break;
        case "message":
          const { srcUserId, chatId, message } = data;
          const usersOfChat = await getUsersOfChat(chatId);
          const targetUserId = usersOfChat.find(
            (user) => user.user_id !== srcUserId,
          ).user_id;
          const response = await createMessage(chatId, srcUserId, message);
          const srcUserName = (await getUserById(srcUserId))[0].user_name;
          const targetUserConnection = webSocketConnections[targetUserId];

          if (targetUserConnection && targetUserConnection.connected) {
            targetUserConnection.sendUTF(
              JSON.stringify({
                type: "message",
                data: {
                  content: message,
                  created_at: response.created_at,
                  message_id: response.message_id,
                  user_id: response.user_id,
                  user_name: srcUserName,
                },
              }),
            );
          }
          break;
      }
    }
  });
});

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
    res.sendStatus(204);
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

app.post("/message", verifyToken, async function handleCreateMessage(req, res) {
  try {
    const { userId, chatId, message } = req.body;

    const result = await createMessage(chatId, userId, message);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: getErrorMessage(error) });
  }
});

app.patch(
  "/message/:id",
  verifyToken,
  async function handleUpdateMessage(req, res) {
    try {
      const { id } = req.params;
      const { message } = req.body;

      await updateMessage(id, message);
      res.sendStatus(204);
    } catch (error) {
      res
        .status(error.message === ERROR_MESSAGES.NoMessage ? 404 : 500)
        .send({ message: getErrorMessage(error) });
    }
  },
);

app.delete(
  "/message/:id",
  verifyToken,
  async function handleMessageDelete(req, res) {
    try {
      const { id } = req.params;

      await deleteMessage(id);
      res.sendStatus(204);
    } catch (error) {
      res
        .status(error.message === ERROR_MESSAGES.NoMessage ? 404 : 500)
        .send({ message: getErrorMessage(error) });
    }
  },
);

app.get(
  "/message/chat/:id",
  verifyToken,
  async function handleGetAllMessages(req, res) {
    try {
      const { id, sortDir } = req.params;

      if (sortDir && (sortDir !== "asc" || sortDir !== "desc")) {
        throw new Error("sortDir isnt valid value");
      }

      const messages = await getAllMessage(id, sortDir);
      res.status(200).send({ messages });
    } catch (error) {
      res.status(500).send({ message: getErrorMessage(error) });
    }
  },
);

server.listen(process.env.API_PORT);
