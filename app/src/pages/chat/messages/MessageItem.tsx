import { Card, Flex, Text } from "@radix-ui/themes";
import { IMessage } from "../chat.types";
import { getLoggedUserId } from "src/common/user/user";

const isLoggedUserMessage = (message: IMessage): boolean => {
  return message.user_id === getLoggedUserId();
};

const Time = ({ time }: { time: string }) => {
  return (
    <Text size="1" color="gray" style={{ flexShrink: 0 }}>
      {time}
    </Text>
  );
};

const ChatMessageItem = ({
  message,
  messageTime,
}: {
  message: IMessage;
  messageTime: string;
}): JSX.Element => {
  return (
    <Flex
      style={{
        alignSelf: isLoggedUserMessage(message) ? "flex-end" : "flex-start",
      }}
      maxHeight={{ initial: "75%", md: "50%" }}
      align="end"
      gap="2"
    >
      {isLoggedUserMessage(message) ? <Time time={messageTime} /> : null}
      <Card
        size="1"
        style={{
          padding: "8px",
          border: "1px solid var(--accent-6)",
          backgroundColor: isLoggedUserMessage(message)
            ? "var(--accent-10)"
            : "var(--accent-2)",
        }}
      >
        <Text as="p" size="2">
          {message.content}
        </Text>
      </Card>
      {!isLoggedUserMessage(message) ? <Time time={messageTime} /> : null}
    </Flex>
  );
};

export default ChatMessageItem;
