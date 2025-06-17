import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  ListItemAvatar,
  Avatar,
  styled,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { css } from "@emotion/css";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import SentimentSatisfiedRoundedIcon from "@mui/icons-material/SentimentSatisfiedRounded";
import { IChat, IMessage } from "../chat.types";
import {
  getAvatarName,
  getFullName,
  getLoggedUserId,
} from "../../../common/utils/user";
import { getFormattedDate } from "../../../common/utils/date";
import { useState, useRef, useEffect } from "react";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    backgroundColor: theme.palette.background.default,
    borderRadius: "12px",
    padding: "8px 14px",
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
}));

const StyledSendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: 40,
  height: 40,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
}));

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
    justify-content: space-between;
    padding: 8px 16px;
    background-color: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  `,
  headerLeft: css`
    display: flex;
    align-items: center;
  `,
  headerRight: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,
  messagesContainer: css`
    flex-grow: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    scroll-behavior: smooth;

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;
    scrollbar-width: thin;

    /* Custom scrollbar styles */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: 3px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
  `,
  message: css`
    display: flex;
    gap: 6px;
    align-items: flex-start;
    max-width: 60%;
    margin-bottom: 2px;
    padding: 8px 12px;
    position: relative;
  `,
  sentMessage: css`
    background-color: #36b37e !important;
    align-self: flex-end;
    color: white;
    border-radius: 14px 14px 4px 14px;
  `,
  receivedMessage: css`
    align-self: flex-start;
    background-color: rgba(255, 255, 255, 0.06) !important;
    border-radius: 14px 14px 14px 4px;
  `,
  inputContainer: css`
    padding: 12px 16px;
    background-color: rgba(255, 255, 255, 0.02);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    gap: 12px;
  `,
  inputActions: css`
    display: flex;
    align-items: center;
    gap: 4px;
  `,
  typingIndicator: css`
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
    margin-left: 16px;
  `,
  typingDot: css`
    width: 4px;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;

    &:nth-of-type(2) {
      animation-delay: 0.2s;
    }

    &:nth-of-type(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%,
      60%,
      100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-4px);
      }
    }
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

// Helper function to group messages by date
const TypingIndicator = () => (
  <Box className={styles.typingIndicator}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontSize: "0.75rem" }}
    >
      typing
    </Typography>
    <span className={styles.typingDot} />
    <span className={styles.typingDot} />
    <span className={styles.typingDot} />
  </Box>
);

const ChatArea = ({
  selectedChat,
  input,
  messages,
  onInputChange,
  onSend,
  onKeyPress,
}: IChatAreaProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages, selectedChat]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!selectedChat) {
    return (
      <Box
        className={styles.container}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          flex: 1,
          minHeight: 0,
          background: "#1a1a1e",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            color: "rgba(255,255,255,0.5)",
            p: 4,
            borderRadius: 2,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ mb: 1, fontSize: "1.2rem" }}
          >
            Select a chat to start messaging
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
            Choose a conversation from the list or start a new one.
          </Typography>
        </Box>
      </Box>
    );
  }

  const isTyping = false; // TODO: Implement typing indicator logic

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Box className={styles.headerLeft}>
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                color: "#fff",
                width: 40,
                height: 40,
                fontSize: "0.95rem",
              }}
            >
              {getAvatarName(
                selectedChat.users[0].first_name,
                selectedChat.users[0].last_name,
              )}
            </Avatar>
          </ListItemAvatar>
          <Box>
            <Typography variant="subtitle1" component="p" fontWeight={500}>
              {getFullName(
                selectedChat.users[0].first_name,
                selectedChat.users[0].last_name,
              )}
            </Typography>
            <Typography
              variant="caption"
              component="p"
              color="text.secondary"
              sx={{ fontSize: "0.75rem" }}
            >
              Active now
            </Typography>
          </Box>
        </Box>
        <Box className={styles.headerRight}>
          <Tooltip title="More options">
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              "& .MuiList-root": {
                paddingTop: 0,
                paddingBottom: 0,
              },
            }}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: "#23232b",
                  color: "#fff",
                  borderRadius: 2,
                  boxShadow: "0 4px 24px 0 rgba(0,0,0,0.25)",
                  minWidth: 160,
                  p: 0,
                  border: "1px solid rgba(255,255,255,0.08)",
                },
              },
            }}
          >
            <Tooltip title="Coming soon" arrow placement="top">
              <span>
                <MenuItem
                  disabled
                  sx={{
                    borderRadius: 1,
                    mx: 0.5,
                    my: 0.5,
                    fontSize: "0.97rem",
                    color: "#fff",
                    opacity: 0.5,
                    pointerEvents: "none",
                    transition: "background 0.2s",
                  }}
                >
                  Clear Chat
                </MenuItem>
              </span>
            </Tooltip>
            <Tooltip title="Coming soon" arrow placement="top">
              <span>
                <MenuItem
                  disabled
                  sx={{
                    borderRadius: 1,
                    mx: 0.5,
                    my: 0.5,
                    fontSize: "0.97rem",
                    color: "#fff",
                    opacity: 0.5,
                    pointerEvents: "none",
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  Delete Chat
                </MenuItem>
              </span>
            </Tooltip>
            <Tooltip title="Coming soon" arrow placement="top">
              <span>
                <MenuItem
                  disabled
                  sx={{
                    borderRadius: 1,
                    mx: 0.5,
                    my: 0.5,
                    fontSize: "0.97rem",
                    color: "#fff",
                    opacity: 0.5,
                    pointerEvents: "none",
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  Block User
                </MenuItem>
              </span>
            </Tooltip>
          </Menu>
        </Box>
      </Box>{" "}
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
            {" "}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.85rem",
                  lineHeight: 1.4,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  paddingRight: "48px",
                }}
              >
                {msg.content}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.65rem",
                  opacity: 0.7,
                  position: "absolute",
                  right: "12px",
                  bottom: "8px",
                }}
              >
                {getFormattedDate(new Date(msg.created_at))}
              </Typography>
            </Box>
          </Paper>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </Box>
      <Box className={styles.inputContainer}>
        <Box className={styles.inputActions}>
          <Tooltip title="Coming soon: Attach files" arrow>
            <span>
              <IconButton
                size="small"
                disabled
                sx={{ opacity: 0.5, pointerEvents: "none" }}
              >
                <AttachFileRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Coming soon: Emoji picker" arrow>
            <span>
              <IconButton
                size="small"
                disabled
                sx={{ opacity: 0.5, pointerEvents: "none" }}
              >
                <SentimentSatisfiedRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        <StyledTextField
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
        <StyledSendButton
          onClick={onSend}
          color="primary"
          disabled={input.trim().length === 0}
        >
          <SendRoundedIcon sx={{ color: "#fff", fontSize: 24 }} />
        </StyledSendButton>
      </Box>
    </Box>
  );
};

export default ChatArea;
