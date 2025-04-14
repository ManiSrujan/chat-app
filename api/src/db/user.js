import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Client } = pg;

function createClient() {
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
  });

  return client;
}

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

async function getAllUsers() {
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query("SELECT * FROM appuser");

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

export { createUser, getAllUsers, getUser };
