import {
  Box,
  TextField,
  IconButton,
  Avatar,
  Typography,
  styled,
} from "@mui/material";
import { css } from "@emotion/css";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import SentimentSatisfiedRoundedIcon from "@mui/icons-material/SentimentSatisfiedRounded";
import { IChat, IMessage } from "../chat.types";
import { getLoggedUserId, getFullName } from "../../../common/utils/user";
import { getFormattedDate, getTimeString } from "../../../common/utils/date";
import { useEffect, useRef } from "react";

interface ChatAreaProps {
  selectedChat?: IChat;
  messages: IMessage[];
  input: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
}

const MessageTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: "16px",
    padding: "10px 16px",
    fontSize: "0.9rem",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 20px rgba(54, 179, 126, 0.15)",
      border: "1px solid rgba(54, 179, 126, 0.3)",
    },
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.04)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiInputBase-input": {
    color: "#fff",
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.5)",
      opacity: 1,
    },
  },
});

const ActionButton = styled(IconButton)({
  color: "rgba(255, 255, 255, 0.7)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  padding: "8px",
  borderRadius: "12px",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  "&:hover": {
    color: "#36B37E",
    transform: "translateY(-2px)",
    backgroundColor: "rgba(54, 179, 126, 0.1)",
    border: "1px solid rgba(54, 179, 126, 0.2)",
    boxShadow: "0 4px 12px rgba(54, 179, 126, 0.15)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "& .MuiSvgIcon-root": {
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  "&:hover .MuiSvgIcon-root": {
    transform: "scale(1.1)",
  },
});

const SendButton = styled(IconButton)({
  backgroundColor: "#36B37E",
  width: 42,
  height: 42,
  borderRadius: "14px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: "#2C9066",
    transform: "translateY(-2px) scale(1.05)",
    boxShadow: "0 4px 20px rgba(54, 179, 126, 0.3)",
  },
  "&:active": {
    transform: "translateY(0) scale(0.95)",
  },
  "& .MuiSvgIcon-root": {
    fontSize: 20,
    color: "#fff",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  "&:hover .MuiSvgIcon-root": {
    transform: "rotate(10deg)",
  },
});

const styles = {
  container: css`
    background: #1a1a1e;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    min-width: 0;
    flex-basis: 70%;
    overflow: hidden;

    @media (max-width: 600px) {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }
  `,
  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    background-color: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    height: 56px;
  `,
  headerLeft: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,
  headerRight: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,
  logoutButton: css`
    color: rgba(255, 255, 255, 0.7);
    background: none;
    border: none;
    padding: 8px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    position: relative;

    &:after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.2s ease-in-out;
    }

    svg {
      width: 20px;
      height: 20px;
      transition: all 0.2s ease-in-out;
    }

    &:hover {
      color: #36b37e;
      background: rgba(54, 179, 126, 0.1);
      transform: translateY(-1px);

      &:after {
        border-color: rgba(54, 179, 126, 0.2);
      }
    }

    &:active {
      transform: scale(0.95);
    }
  `,
  userName: css`
    color: #fff;
    font-weight: 600;
    font-size: 0.8rem;
  `,
  status: css`
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem !important;
  `,
  messagesArea: css`
    flex-grow: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    @media (max-width: 600px) {
      padding: 12px;
      height: calc(100vh - 130px);
    }

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `,
  messageWrapper: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
    animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: bottom;

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.98);
        filter: blur(2px);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    &:hover [class*="messageTime"] {
      opacity: 1;
    }
  `,
  message: css`
    max-width: 65%;
    padding: 8px 12px;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.03);
    color: #fff;
    font-size: 0.85rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    line-height: 1.4;
    display: inline-flex;
    align-items: flex-end;
    gap: 6px;
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    transform-origin: center left;
    will-change: transform;

    &:before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        45deg,
        transparent 0%,
        rgba(255, 255, 255, 0.05) 100%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-2px) scale(1.01);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

      &:before {
        opacity: 1;
      }

      [class*="messageTime"] {
        transform: scale(1.05);
      }
    }

    &:active {
      transform: scale(0.98);
      transition: transform 0.1s ease;
    }
  `,
  sentMessage: css`
    align-self: flex-end;
    background-color: rgba(54, 179, 126, 0.15);
    border: 1px solid rgba(54, 179, 126, 0.2);
    transform-origin: center right;

    &:hover {
      background-color: rgba(54, 179, 126, 0.2);
      box-shadow: 0 4px 12px rgba(54, 179, 126, 0.15);
      transform: translateY(-2px) scale(1.01);
    }

    &:before {
      background: linear-gradient(
        45deg,
        transparent 0%,
        rgba(54, 179, 126, 0.1) 100%
      );
    }
  `,
  receivedMessage: css`
    align-self: flex-start;

    &:hover {
      box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
    }
  `,
  messageTime: css`
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.55rem;
    opacity: 0.6;
    margin-bottom: 1px;
    white-space: nowrap;
    align-self: flex-end;
    margin-top: 2px;
    transition: opacity 0.2s ease;
    position: relative;
    padding-left: 16px;

    &:before {
      content: "•";
      position: absolute;
      left: 6px;
      opacity: 0.7;
    }
  `,
  typingIndicator: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
    margin: 4px 0;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.6);

    span {
      width: 4px;
      height: 4px;
      background: currentColor;
      border-radius: 50%;
      display: inline-block;
      animation: typingDot 1.4s infinite;

      &:nth-of-type(2) {
        animation-delay: 0.2s;
      }
      &:nth-of-type(3) {
        animation-delay: 0.4s;
      }
    }

    @keyframes typingDot {
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
  inputArea: css`
    padding: 16px 20px;
    background-color: rgba(255, 255, 255, 0.02);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    position: relative;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
      );
    }

    @media (max-width: 600px) {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px 16px;
    }
  `,
  inputWrapper: css`
    display: flex;
    align-items: flex-end;
    gap: 16px;
    max-width: 1200px;
    margin: 0 auto;
  `,
  actionsWrapper: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,
  dateHeader: css`
    text-align: center;
    padding: 20px 0 12px;
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.65rem;
    position: relative;
    margin: 0;

    span {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 10px;

      &:before,
      &:after {
        content: "";
        height: 1px;
        width: 24px;
        background: rgba(255, 255, 255, 0.1);
      }
    }

    @media (min-width: 600px) {
      span {
        &:before,
        &:after {
          width: 48px;
        }
      }
    }
  `,
};

const ChatArea: React.FC<ChatAreaProps> = ({
  selectedChat,
  messages,
  input,
  onInputChange,
  onSend,
  onKeyPress,
}) => {
  const currentUserId = getLoggedUserId();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!selectedChat) {
    return (
      <Box className={styles.container}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {" "}
          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "0.85rem",
              textAlign: "center",
              maxWidth: "80%",
              lineHeight: 1.5,
            }}
          >
            Select a chat to start messaging
          </Typography>
        </Box>
      </Box>
    );
  }

  const otherUser =
    selectedChat.users.find((u) => u.user_id !== currentUserId) ??
    selectedChat.users[0];
  const userName = getFullName(otherUser.first_name, otherUser.last_name);
  const avatarText =
    `${otherUser.first_name[0]}${otherUser.last_name[0]}`.toUpperCase();

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Box className={styles.headerLeft}>
          <Avatar
            sx={{
              background: "linear-gradient(45deg, #36B37E 30%, #2C9066 90%)",
              width: 32,
              height: 32,
              fontSize: "0.8rem",
              position: "relative",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&::after": {
                content: '""',
                position: "absolute",
                inset: -2,
                padding: 2,
                borderRadius: "50%",
                background:
                  "linear-gradient(45deg, rgba(54, 179, 126, 0.5), rgba(44, 144, 102, 0.5))",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              },
              "@keyframes pulse": {
                "0%, 100%": {
                  transform: "scale(1)",
                  opacity: 1,
                },
                "50%": {
                  transform: "scale(1.05)",
                  opacity: 0.8,
                },
              },
              "&:hover": {
                transform: "scale(1.1) rotate(5deg)",
                boxShadow: "0 4px 12px rgba(54, 179, 126, 0.25)",
              },
            }}
          >
            {avatarText}
          </Avatar>
          <Box>
            <Typography className={styles.userName}>{userName}</Typography>
            <Typography className={styles.status}>Online</Typography>{" "}
          </Box>
        </Box>
        <Box className={styles.headerRight}>
          <button
            className={styles.logoutButton}
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
          </button>
        </Box>
      </Box>

      <Box className={styles.messagesArea}>
        {messages.map((message, index) => {
          const messageDate = getFormattedDate(new Date(message.created_at));
          const messageTime = getTimeString(new Date(message.created_at));
          const showDateSeparator =
            index === 0 ||
            new Date(message.created_at).toDateString() !==
              new Date(messages[index - 1].created_at).toDateString();

          return (
            <Box key={message.message_id} className={styles.messageWrapper}>
              {showDateSeparator && (
                <div className={styles.dateHeader}>
                  <span>{messageDate}</span>
                </div>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    message.user_id === currentUserId
                      ? "flex-end"
                      : "flex-start",
                  width: "100%",
                }}
              >
                <Box
                  className={`${styles.message} ${
                    message.user_id === currentUserId
                      ? styles.sentMessage
                      : styles.receivedMessage
                  }`}
                >
                  <span>{message.content}</span>
                  <span className={styles.messageTime}>{messageTime}</span>
                </Box>
              </Box>
            </Box>
          );
        })}
        {/* Uncomment the line below to show typing indicator */}
        {/* <TypingIndicator /> */}
        <div ref={messagesEndRef} style={{ height: 1 }} />
      </Box>

      <Box className={styles.inputArea}>
        <Box className={styles.inputWrapper}>
          <Box className={styles.actionsWrapper}>
            <ActionButton size="small">
              <AttachFileRoundedIcon />
            </ActionButton>
            <ActionButton size="small">
              <SentimentSatisfiedRoundedIcon />
            </ActionButton>
          </Box>
          <MessageTextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={input}
            onChange={onInputChange}
            onKeyPress={onKeyPress}
          />
          <SendButton onClick={onSend}>
            <SendRoundedIcon />
          </SendButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatArea;
