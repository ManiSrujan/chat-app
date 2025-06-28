import { Card, Flex, ScrollArea, Text } from "@radix-ui/themes";
import { IChat, IMessage } from "../chat.types";
import UserCard from "@user-card";
import Messages from "../messages/Messages";
import MessageInput from "./MessageInput";

const ChatArea = ({
  selectedChat,
  messages,
  input,
  handleInputChange,
  handleSend,
  handleKeyPress,
}: {
  selectedChat: IChat | undefined;
  input: string;
  messages: IMessage[];
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSend: () => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
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
        <UserCard
          firstName={chatUser.first_name}
          lastName={chatUser.last_name}
          // TODO: Add online status functionality later
          description="online"
        />
      </Card>
      <ScrollArea type="hover" scrollbars="vertical">
        <Card size="3" style={{ flexGrow: "1" }}>
          <Messages messages={messages} />
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
