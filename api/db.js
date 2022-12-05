import { Client } from './deps.js';

export const connectDB = async () => {
  const env = Deno.env.toObject();
  console.log("Connecting to database...")
  console.log("env:", env);

  const client = new Client({
    hostname: env.PGHOST,
    database: env.PGDATABASE,
    user: env.PGUSER,
    password: env.PGPASSWORD,
    port: env.PGPORT,
  });
  await client.connect();
  return client;
}

export const queryAllMessages = async (client) => {
  const result = await client.queryObject("SELECT * FROM messages;");
  return result.rows;
}

export const queryMessageById = async (client, messageid) => {
  const result = await client.queryObject(
    "SELECT * FROM messages WHERE id=$messageid;",
    {
      messageid: messageid
    }
  );
  return result.rows;
}

export const queryAllReplies = async (client, messageid) => {
  const result = await client.queryObject(
    "SELECT * FROM messages WHERE reply_to=$messageid;",
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