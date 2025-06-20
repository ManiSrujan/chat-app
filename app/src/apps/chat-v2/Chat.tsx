import { Box, Paper, CircularProgress, Typography } from "@mui/material";
import { css } from "@emotion/css";
import useChatArea from "./chat-area/useChatArea";
import useChatList from "./chat-list/useChatList";
import ChatList from "./chat-list/ChatList";
import ChatArea from "./chat-area/ChatArea";
import useSocketCommunication from "./useSocketCommunication";
import { useState } from "react";
import { IMessage } from "./chat.types";

const chatStyles = {
  container: css`
    min-height: 100vh;
    display: flex;
    background: #121214;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h1v1H0z" fill="rgba(255,255,255,0.03)"%3E%3C/path%3E%3C/svg%3E');
      opacity: 0.3;
      pointer-events: none;
    }
  `,
  paper: css`
    height: 100vh;
    width: 100%;
    display: flex;
    overflow: hidden;
    border-radius: 12px;
    background: #1a1a1e;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    position: relative;
    z-index: 1;

    @media (max-width: 600px) {
      height: 100vh;
      margin: 0;
      border-radius: 0;
      transition: transform 0.3s ease-in-out;

      &.chat-selected {
        transform: translateX(-100%);
      }
    }
  `,
  loadingContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #121214;
    position: relative;
    z-index: 1;
  `,
};

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { chats, selectedChat, handleChatSelect, loading, error, setChats } =
    useChatList();
  const { input, handleInputChange, handleSend, handleKeyPress } = useChatArea(
    setMessages,
    setChats,
    selectedChat,
  );
  const { client } = useSocketCommunication(setMessages);

  // Create wrapper for input change handler to match expected type
  const handleInputChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e.target.value);
  };

  if (loading) {
    return (
      <Box className={chatStyles.loadingContainer}>
        <CircularProgress sx={{ color: "#36B37E" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={chatStyles.loadingContainer}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className={chatStyles.container}>
      <Paper
        square={false}
        elevation={0}
        className={`${chatStyles.paper} ${selectedChat ? "chat-selected" : ""}`}
      >
        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
          setChats={setChats}
        />
        <ChatArea
          selectedChat={selectedChat}
          input={input}
          messages={messages}
          onInputChange={handleInputChangeWrapper}
          onSend={() => handleSend(client)}
          onKeyPress={(event) => handleKeyPress(event, client)}
        />
      </Paper>
    </Box>
  );
};

export default Chat;
