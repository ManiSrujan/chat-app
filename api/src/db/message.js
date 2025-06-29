import { ERROR_MESSAGES } from "../constants.js";
import { createClient } from "../utils/db.js";

async function createMessage(chatId, userId, message) {
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query(
      "INSERT INTO message (chat_id, user_id, content) VALUES ($1, $2, $3) RETURNING message_id, user_id, content, created_at",
      [chatId, userId, message],
    );

    // TODO: Add error handling when chat or user doesnt exist
    return result.rows[0];
  } finally {
    await client.end();
  }
}

async function updateMessage(messageId, newMesage) {
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query(
      "UPDATE message SET content = $1 WHERE message_id = $2",
      [newMesage, messageId],
    );

    if (!result.rowCount) {
      throw new Error(ERROR_MESSAGES.NoMessage);
    }
  } finally {
    await client.end();
  }
}

async function deleteMessage(messageId) {
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query(
      "DELETE FROM message WHERE message_id = $1",
      [messageId],
    );

    if (!result.rowCount) {
      throw new Error(ERROR_MESSAGES.NoMessage);
    }
  } finally {
    await client.end();
  }
}

async function getAllMessage(
  chatId,
  sortDir = "desc",
  pageNumber = 1,
  pageSize = 25,
) {
  const client = createClient();

  try {
    await client.connect();

    // TODO: Improve performance of this query by using indexes
    const result = await client.query(
      `SELECT message_id, message.user_id, user_name, content, created_at, chat_id 
      FROM message JOIN appuser ON message.user_id = appuser.user_id 
      WHERE chat_id = $1 ORDER BY message.created_at ${sortDir} LIMIT $2 OFFSET $3`,
      [chatId, pageSize, (pageNumber - 1) * pageSize],
    );

    return result.rows ?? [];
  } finally {
    await client.end();
  }
}

export { createMessage, updateMessage, deleteMessage, getAllMessage };
