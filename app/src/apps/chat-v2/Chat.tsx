import { Box, Paper, CircularProgress, Typography } from "@mui/material";
import { css } from "@emotion/css";
import useChatArea from "./chat-area/useChatArea";
import useChatList from "./chat-list/useChatList";
import ChatList from "./chat-list/ChatList";
import ChatArea from "./chat-area/ChatArea";

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
  const { chats, selectedChat, handleChatSelect, loading, error } =
    useChatList();
  const { message, messages, handleMessageChange, handleSend, handleKeyPress } =
    useChatArea(selectedChat);

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
        message={message}
        messages={messages}
        onMessageChange={handleMessageChange}
        onSend={handleSend}
        onKeyPress={handleKeyPress}
      />
    </Paper>
  );
};

export default Chat;
