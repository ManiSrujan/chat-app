export const GET_CHATS_QUERY = `WITH UserChats AS (
  SELECT chat_id
  FROM User_Chat
  WHERE user_id = $1
),

OtherUsers AS (
  SELECT 
    uc.chat_id, 
    au.user_id, 
    au.first_name, 
    au.last_name
  FROM User_Chat uc
  JOIN AppUser au ON uc.user_id = au.user_id
  WHERE uc.chat_id IN (SELECT chat_id FROM UserChats)
    AND uc.user_id != $1
),

LastMessages AS (
  SELECT DISTINCT ON (m.chat_id)
    m.chat_id,
    m.message_id,
    m.user_id,
    au.user_name,
    m.content,
    m.created_at
  FROM Message m
  JOIN AppUser au ON m.user_id = au.user_id
  WHERE m.chat_id IN (SELECT chat_id FROM UserChats)
  ORDER BY m.chat_id, m.created_at DESC
)

SELECT 
  uc.chat_id,
  json_agg(json_build_object(
    'user_id', ou.user_id,
    'first_name', ou.first_name,
    'last_name', ou.last_name
  )) AS users,
  json_build_object(
    'message_id', lm.message_id,
    'user_id', lm.user_id,
    'user_name', lm.user_name,
    'content', lm.content,
    'created_at', lm.created_at
  ) AS last_message
FROM UserChats uc
LEFT JOIN OtherUsers ou ON uc.chat_id = ou.chat_id
LEFT JOIN LastMessages lm ON uc.chat_id = lm.chat_id
GROUP BY uc.chat_id, lm.message_id, lm.user_id, lm.user_name, lm.content, lm.created_at;`;
