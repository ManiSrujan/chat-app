import { Flex, Separator, Text } from "@radix-ui/themes";
import { IMessage } from "../chat.types";
import { getFormattedDate, getTimeString } from "src/common/date/date";
import MessageItem from "./MessageItem";
import { CommitIcon } from "@radix-ui/react-icons";

const DateSeparator = ({ date }: { date: string }): JSX.Element => {
  return (
    <Flex align="center" gap="3" style={{ color: "var(--gray-11)" }}>
      <CommitIcon color="gray" />
      <Separator size="3"></Separator>
      <Text size="1">{date}</Text>
      <Separator size="3"></Separator>
      <CommitIcon color="gray" />
    </Flex>
  );
};

const Messages = ({ messages }: { messages: IMessage[] }): JSX.Element => {
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
    </Flex>
  );
};

export default Messages;
