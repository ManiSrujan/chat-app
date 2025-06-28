import { Box, Flex } from "@radix-ui/themes";
import ChatList from "./chat-list/ChatList";
import ChatArea from "./chat-area/ChatArea";
import useChatList from "./chat-list/useChatList";
import useChatArea from "./chat-area/useChatArea";
import useSocketCommunication from "./useSocketCommunication";

const Chat = (): JSX.Element => {
  const { chats, selectedChat, handleChatSelect, changeLastMessage } =
    useChatList();
  const {
    messages,
    input,
    handleInputChange,
    handleKeyPress,
    handleSend,
    addMessageToChat,
    scrollRef,
  } = useChatArea(selectedChat, changeLastMessage);
  const { client } = useSocketCommunication(addMessageToChat);

  return (
    <Flex p="4" height="100vh" gap="2">
      <Box width="300px">
        <ChatList chats={chats} onSelect={handleChatSelect} />
      </Box>
      <Box height="100%" flexGrow="1">
        <ChatArea
          selectedChat={selectedChat}
          messages={messages}
          input={input}
          handleInputChange={(e) => handleInputChange(e.target.value)}
          handleSend={() => handleSend(client)}
          handleKeyPress={(e) => handleKeyPress(e, client)}
          scrollRef={scrollRef}
        />
      </Box>
    </Flex>
  );
};

export default Chat;
