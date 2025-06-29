import { Avatar, Box, Card, Flex, ScrollArea, Text } from "@radix-ui/themes";
import ChatListItem from "./ChatListItem";
import ChatSearch from "./ChatSearch";
import { IChat } from "../chat.types";

const ChatList = ({
  chats,
  onSelect,
}: {
  chats: IChat[];
  onSelect: (chat: IChat) => void;
}): JSX.Element => {
  return (
    <Card
      style={{
        position: "relative",
        height: "100%",
        padding: 0,
      }}
    >
      <Box p="4">
        <Flex direction="column" gap="4">
          <Flex align="center" justify="between">
            <Text weight="medium">Chats</Text>
            <Avatar fallback="A" radius="full" className="profile" />
          </Flex>
          <ChatSearch />
        </Flex>
      </Box>
      <ScrollArea
        type="hover"
        style={{ height: "calc(100% - 120px)" }}
        scrollbars="vertical"
      >
        <Flex direction="column">
          {chats.map((chat) => (
            <ChatListItem key={chat.chat_id} chat={chat} onSelect={onSelect} />
          ))}
        </Flex>
      </ScrollArea>
    </Card>
  );
};

export default ChatList;
