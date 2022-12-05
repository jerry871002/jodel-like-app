CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  userid TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  top_level BOOLEAN,
  reply_to INT
);