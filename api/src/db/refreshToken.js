import { createClient } from "../utils/db.js";

async function addTokenToDb(token) {
  const client = createClient();

  try {
    await client.connect();

    await client.query("INSERT INTO refreshtoken (token) VALUES ($1)", [token]);
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

async function isTokenInDb(token) {
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query(
      "SELECT * FROM refreshtoken WHERE token=$1",
      [token],
    );
    return Boolean(result.rowCount);
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

export { addTokenToDb, isTokenInDb };
