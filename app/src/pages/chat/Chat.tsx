import { Box, Flex } from "@radix-ui/themes";
import ChatList from "./chat-list/ChatList";
import ChatArea from "./chat-area/ChatArea";
import useChatList from "./chat-list/useChatList";
import useChatArea from "./chat-area/useChatArea";
import useSocketCommunication from "./useSocketCommunication";

const Chat = (): JSX.Element => {
  const {
    chats,
    selectedChat,
    handleChatSelect,
    changeLastMessage,
    createChat,
  } = useChatList();
  const {
    messages,
    input,
    scrollRef,
    intersectionRef,
    handleInputChange,
    handleKeyPress,
    handleSend,
    addMessageToChat,
  } = useChatArea(selectedChat, changeLastMessage);
  const { client } = useSocketCommunication(addMessageToChat);

  return (
    <Flex p="4" height="100vh" gap="2">
      <Box width="300px">
        <ChatList
          chats={chats}
          onSelect={handleChatSelect}
          onUserSelect={createChat}
        />
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
          intersectionRef={intersectionRef}
        />
      </Box>
    </Flex>
  );
};

export default Chat;
