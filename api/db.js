import { Client } from './deps.js';

export const connectDB = async () => {
  const PGPASS = Deno.env.get("PGPASS").trim();
  console.log("Connecting to database...")
  console.log("PGPASS:", PGPASS);

  const PGPASS_PARTS = PGPASS.split(":");
  const host = PGPASS_PARTS[0];
  const port = PGPASS_PARTS[1];
  const database = PGPASS_PARTS[2];
  const username = PGPASS_PARTS[3];
  const password = PGPASS_PARTS[4];

  const client = new Client({
    hostname: host,
    database: database,
    user: username,
    password: password,
    port: port,
  });
  await client.connect();
  return client;
}

export const queryAllMessages = async (client) => {
  const result = await client.queryObject("SELECT * FROM messages WHERE top_level=TRUE ORDER BY created_at DESC LIMIT 20;");
  return result.rows;
}

export const queryMessageById = async (client, messageid) => {
  const result = await client.queryObject(
    "SELECT * FROM messages WHERE id=$messageid AND top_level=TRUE ORDER BY created_at DESC;",
    {
      messageid: messageid
    }
  );
  return result.rows;
}

export const queryAllReplies = async (client, messageid) => {
  const result = await client.queryObject(
    "SELECT * FROM messages WHERE reply_to=$messageid ORDER BY created_at DESC;",
    {
      messageid: messageid
    }
  );
  return result.rows;
}

export const insertMessage = async (client, { userid, content, top_level, reply_to }) => {
  await client.queryObject(
    "INSERT INTO messages (userid, content, top_level, reply_to) VALUES ($userid, $content, $top_level, $reply_to);",
    {
      userid: userid,
      content: content,
      top_level: top_level,
      reply_to: reply_to
    }
  );
}