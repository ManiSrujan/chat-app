import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { css } from "@emotion/css";
import SendIcon from "@mui/icons-material/Send";
import { IChat, IMessage } from "../chat.types";
import {
  getAvatarName,
  getFullName,
  getLoggedUserId,
} from "../../../common/utils/user";
import { getFormattedDate } from "../../../common/utils/date";

const styles = {
  container: css`
    background: #1a1a1e;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  `,
  header: css`
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  `,
  messagesContainer: css`
    flex-grow: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
  `,
  message: css`
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    max-width: 70%;
    margin-bottom: 8px;
    padding: 8px;
  `,
  sentMessage: css`
    background-color: #036825 !important;
    align-self: flex-end;
    color: white;
  `,
  receivedMessage: css`
    align-self: flex-start;
    background-color: #272727 !important;
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
  selectedChat?: IChat;
  input: string;
  messages: IMessage[];
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
}

const ChatArea = ({
  selectedChat,
  input,
  messages,
  onInputChange,
  onSend,
  onKeyPress,
}: IChatAreaProps) => {
  if (!selectedChat) {
    return (
      <Box
        className={styles.container}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography color="text.secondary">
          Select a chat to start chatting
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "#036825", color: "#fff" }}>
            {getAvatarName(
              selectedChat.users[0].first_name,
              selectedChat.users[0].last_name,
            )}
          </Avatar>
        </ListItemAvatar>
        <Typography variant="h6">
          {getFullName(
            selectedChat.users[0].first_name,
            selectedChat.users[0].last_name,
          )}
        </Typography>
      </Box>

      <Box className={styles.messagesContainer}>
        {messages.map((msg) => (
          <Paper
            key={msg.message_id}
            className={`${styles.message} ${
              msg.user_id === getLoggedUserId()
                ? styles.sentMessage
                : styles.receivedMessage
            }`}
            elevation={0}
          >
            <Typography variant="body2">{msg.content}</Typography>
            <Typography
              variant="caption"
              sx={{
                opacity: 0.7,
                lineHeight: 0,
                position: "relative",
                top: "5px",
              }}
            >
              {getFormattedDate(new Date(msg.created_at))}
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
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyPress}
          variant="outlined"
          size="small"
        />
        <IconButton color="primary" onClick={onSend} disabled={!input.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatArea;
