import { Box, Typography, TextField, IconButton, Paper } from "@mui/material";
import { css } from "@emotion/css";
import SendIcon from "@mui/icons-material/Send";
import { IChatUser, IMessage } from "../chat.types";

const styles = {
  container: css`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  `,
  header: css`
    padding: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  `,
  messagesContainer: css`
    flex-grow: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
  `,
  message: css`
    margin-bottom: 8px;
    max-width: 70%;
    padding: 8px 16px;
    border-radius: 12px;
  `,
  sentMessage: css`
    align-self: flex-end;
    background-color: #1976d2;
    color: white;
  `,
  receivedMessage: css`
    align-self: flex-start;
    background-color: #f5f5f5;
  `,
  inputContainer: css`
    padding: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    gap: 8px;
  `,
};

interface IChatAreaProps {
  selectedUser?: IChatUser;
  message: string;
  messages: IMessage[];
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
}

const ChatArea = ({
  selectedUser,
  message,
  messages,
  onMessageChange,
  onSend,
  onKeyPress,
}: IChatAreaProps) => {
  if (!selectedUser) {
    return (
      <Box
        className={styles.container}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography color="text.secondary">
          Select a user to start chatting
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h6">{selectedUser.userName}</Typography>
      </Box>

      <Box className={styles.messagesContainer}>
        {messages.map((msg) => (
          <Paper
            key={msg.id}
            className={`${styles.message} ${
              msg.sender === "user1"
                ? styles.sentMessage
                : styles.receivedMessage
            }`}
            elevation={0}
          >
            <Typography variant="body1">{msg.content}</Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{ opacity: 0.7, mt: 0.5 }}
            >
              {msg.timestamp}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Box className={styles.inputContainer}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={onKeyPress}
          variant="outlined"
          size="small"
        />
        <IconButton color="primary" onClick={onSend} disabled={!message.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatArea;
