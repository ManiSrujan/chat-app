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
  paper: css`
    height: 100vh;
    display: flex;
    overflow: hidden;
  `,
  loadingContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
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

  if (loading) {
    return (
      <Box className={chatStyles.loadingContainer}>
        <CircularProgress />
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
    <Paper square elevation={3} className={chatStyles.paper}>
      <ChatList
        chats={chats}
        selectedChat={selectedChat}
        onChatSelect={handleChatSelect}
      />
      <ChatArea
        selectedChat={selectedChat}
        input={input}
        messages={messages}
        onInputChange={handleInputChange}
        onSend={() => handleSend(client)}
        onKeyPress={(event) => handleKeyPress(event, client)}
      />
    </Paper>
  );
};

export default Chat;
