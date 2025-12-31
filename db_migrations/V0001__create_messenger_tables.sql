-- Создаём таблицу пользователей
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar VARCHAR(500),
  initials VARCHAR(5) NOT NULL,
  status VARCHAR(20) DEFAULT 'offline',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаём таблицу чатов
CREATE TABLE IF NOT EXISTS chats (
  id SERIAL PRIMARY KEY,
  user1_id INTEGER REFERENCES users(id),
  user2_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user1_id, user2_id)
);

-- Создаём таблицу сообщений
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER REFERENCES chats(id),
  sender_id INTEGER REFERENCES users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаём индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chats_users ON chats(user1_id, user2_id);

-- Добавляем тестовых пользователей
INSERT INTO users (name, email, initials, status) VALUES
  ('Вы', 'you@family.com', 'Я', 'online'),
  ('Мама', 'mama@family.com', 'М', 'online'),
  ('Папа', 'papa@family.com', 'П', 'online'),
  ('Сестра Аня', 'anya@family.com', 'А', 'offline'),
  ('Брат Саша', 'sasha@family.com', 'С', 'online'),
  ('Бабушка', 'babushka@family.com', 'Б', 'offline')
ON CONFLICT (email) DO NOTHING;

-- Создаём чаты между пользователями
INSERT INTO chats (user1_id, user2_id) 
SELECT 1, 2 WHERE NOT EXISTS (SELECT 1 FROM chats WHERE user1_id = 1 AND user2_id = 2);

INSERT INTO chats (user1_id, user2_id) 
SELECT 1, 3 WHERE NOT EXISTS (SELECT 1 FROM chats WHERE user1_id = 1 AND user2_id = 3);

INSERT INTO chats (user1_id, user2_id) 
SELECT 1, 4 WHERE NOT EXISTS (SELECT 1 FROM chats WHERE user1_id = 1 AND user2_id = 4);

INSERT INTO chats (user1_id, user2_id) 
SELECT 1, 5 WHERE NOT EXISTS (SELECT 1 FROM chats WHERE user1_id = 1 AND user2_id = 5);

-- Добавляем тестовые сообщения
INSERT INTO messages (chat_id, sender_id, text, created_at) VALUES
  (1, 2, 'Привет! Как дела?', CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
  (1, 1, 'Всё отлично! У тебя как?', CURRENT_TIMESTAMP - INTERVAL '8 minutes'),
  (1, 2, 'Не забудь позвонить после работы!', CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
  (2, 3, 'Договорились на воскресенье', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
  (3, 4, 'Спасибо за подарок! 💝', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  (4, 5, 'Посмотрел тот фильм, классный!', CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT DO NOTHING;