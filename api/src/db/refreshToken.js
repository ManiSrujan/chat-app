import pg from "pg";

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
