import { Card } from "@radix-ui/themes";
import { IChat } from "../chat.types";
import { getLoggedUserId } from "src/common/user/user";
import UserCard from "@user-card";

const getLastMessage = (chat: IChat) => {
  if (chat.last_message.message_id) {
    if (chat.last_message.user_id === getLoggedUserId()) {
      return `You: ${chat.last_message.content}`;
    }
    return `${chat.last_message.user_name}: ${chat.last_message.content}`;
  }
  return "No messages yet";
};

const ChatListItem = ({
  chat,
  onSelect,
}: {
  chat: IChat;
  onSelect: (chat: IChat) => void;
}) => {
  const chatUser = chat.users[0];

  return (
    <Card
      size="1"
      variant="classic"
      mx="2"
      my="1"
      onClick={() => {
        onSelect(chat);
      }}
    >
      <UserCard
        firstName={chatUser.first_name}
        lastName={chatUser.last_name}
        description={getLastMessage(chat)}
      />
    </Card>
  );
};

export default ChatListItem;
