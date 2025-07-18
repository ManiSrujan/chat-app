import { Card, Flex, IconButton, ScrollArea, Text } from "@radix-ui/themes";
import { IChat, IMessage } from "../chat.types";
import UserCard from "@user-card";
import Messages from "../messages/Messages";
import MessageInput from "./MessageInput";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

const ChatArea = ({
  selectedChat,
  messages,
  input,
  handleInputChange,
  handleSend,
  handleKeyPress,
  scrollRef,
  intersectionRef,
  isMobile,
  resetChatSelection,
}: {
  selectedChat: IChat | undefined;
  input: string;
  messages: IMessage[];
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSend: () => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  intersectionRef: React.RefObject<HTMLDivElement>;
  isMobile?: boolean;
  resetChatSelection?: (chat: IChat | undefined) => void;
}): JSX.Element => {
  if (!selectedChat) {
    return (
      <Flex direction="column" height="100%" align="center" justify="center">
        <Text size="4" weight="regular">
          Select a chat to start messaging
        </Text>
      </Flex>
    );
  }

  const chatUser = selectedChat.users[0];
  return (
    <Flex direction="column" height="100%" gap="2">
      <Card style={{ flexShrink: "0" }}>
        <Flex align="center" gap="4">
          {isMobile ? (
            <IconButton
              variant="ghost"
              size="2"
              onClick={() => resetChatSelection?.(undefined)}
            >
              <ArrowLeftIcon />
            </IconButton>
          ) : null}
          <UserCard
            firstName={chatUser.first_name}
            lastName={chatUser.last_name}
            // TODO: Add online status functionality later
            description="online"
          />
        </Flex>
      </Card>
      <ScrollArea type="hover" scrollbars="vertical" ref={scrollRef}>
        <div ref={intersectionRef}></div>
        <Card size="3" style={{ height: "100%" }}>
          <Messages messages={messages} showTyping={selectedChat?._isTyping} />
        </Card>
      </ScrollArea>
      <Card style={{ flexShrink: "0" }}>
        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleKeyPress={handleKeyPress}
          handleSend={handleSend}
        />
      </Card>
    </Flex>
  );
};

export default ChatArea;
