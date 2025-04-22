import { ERROR_MESSAGES } from "../constants.js";
import { createClient } from "../utils/db.js";

async function createChat(userId1, userId2) {
  const client = createClient();

  try {
    await client.connect();

    // if chat already exists return its chat_id
    const result = await client.query(
      "SELECT uc1.chat_id FROM user_chat AS uc1 JOIN user_chat AS uc2 ON uc1.chat_id = uc2.chat_id WHERE uc1.user_id = $1 AND uc2.user_id = $2",
      [userId1, userId2],
    );

    if (result.rowCount) {
      return result.rows[0]["chat_id"];
    }

    // if it doesnt exist, create one and return newly created chat_id
    await client.query("BEGIN");
    const chatResult = await client.query(
      "INSERT INTO chat DEFAULT VALUES RETURNING chat_id",
    );
    const chatId = chatResult.rows[0]["chat_id"];
    await Promise.all([
      client.query("INSERT INTO user_chat (user_id, chat_id) VALUES ($1, $2)", [
        userId1,
        chatId,
      ]),
      client.query("INSERT INTO user_chat (user_id, chat_id) VALUES ($1, $2)", [
        userId2,
        chatId,
      ]),
    ]);
    await client.query("COMMIT");

    return chatId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

async function deleteChat(chatId) {
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query("DELETE FROM chat WHERE chat_id = $1", [
      chatId,
    ]);

    if (!result.rowCount) {
      throw new Error(ERROR_MESSAGES.ChatDoesntExist);
    }
  } finally {
    await client.end();
  }
}

async function getChats(userId) {
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query(
      "SELECT chat_id FROM user_chat WHERE user_id = $1",
      [userId],
    );

    return result.rows;
  } finally {
    await client.end();
  }
}

export { createChat, deleteChat, getChats };
