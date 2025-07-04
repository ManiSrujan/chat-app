import { Flex, Separator, Text } from "@radix-ui/themes";
import { IMessage } from "../chat.types";
import { getFormattedDate, getTimeString } from "src/common/date/date";
import MessageItem from "./MessageItem";
import Typing from "./Typing";

const DateSeparator = ({ date }: { date: string }): JSX.Element => {
  return (
    <Flex align="center" gap="3" style={{ color: "var(--gray-11)" }}>
      <Separator size="3"></Separator>
      <Text size="1">{date}</Text>
      <Separator size="3"></Separator>
    </Flex>
  );
};

const Messages = ({
  messages,
  showTyping = false,
}: {
  messages: IMessage[];
  showTyping?: boolean;
}): JSX.Element => {
  if (!messages.length) {
    return (
      <Flex direction="column" height="100%" align="center" justify="center">
        <Text size="4" weight="regular">
          No Messages yet
        </Text>
      </Flex>
    );
  }
  return (
    <Flex direction="column" gap="4">
      {messages.map((message, index) => {
        const messageDate = getFormattedDate(new Date(message.created_at));
        const messageTime = getTimeString(new Date(message.created_at));
        const showDateSeparator =
          index === 0 ||
          new Date(message.created_at).toDateString() !==
            new Date(messages[index - 1].created_at).toDateString();

        return (
          <Flex
            direction="column"
            key={message.message_id}
            gap="4"
            align="center"
          >
            {showDateSeparator ? <DateSeparator date={messageDate} /> : null}
            <MessageItem messageTime={messageTime} message={message} />
          </Flex>
        );
      })}
      <Typing show={showTyping} />
    </Flex>
  );
};

export default Messages;
