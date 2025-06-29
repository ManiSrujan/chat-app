import dotenv from "dotenv";
import { createClient } from "../utils/db.js";

dotenv.config();

async function createUser(username, firstname, lastname, password) {
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query(
      "INSERT INTO appuser (user_name, first_name, last_name, hashed_password) VALUES ($1, $2, $3, $4)",
      [username, firstname, lastname, password],
    );

    return result.rowCount;
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

async function getAllUsers(search, pageNumber, pageSize) {
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query(
      `SELECT user_id, first_name, last_name, user_name FROM appuser 
       WHERE first_name ILIKE '%' || $1 || '%' OR 
       last_name ILIKE '%' || $1 || '%' OR 
       user_name ILIKE '%' || $1 || '%' LIMIT $2 OFFSET $3`,
      [search, pageSize, (pageNumber - 1) * pageSize],
    );

    return result.rows;
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

async function getUser(username) {
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query(
      "SELECT * FROM appuser WHERE user_name=$1",
      [username],
    );

    return result.rows;
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

async function getUserById(userId) {
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query(
      "SELECT * FROM appuser WHERE user_id=$1",
      [userId],
    );

    return result.rows;
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

export { createUser, getAllUsers, getUser, getUserById };
