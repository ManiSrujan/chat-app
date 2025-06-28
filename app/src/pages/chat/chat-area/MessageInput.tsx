import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, TextField } from "@radix-ui/themes";

const MessageInput = ({
  input,
  handleInputChange,
  handleSend,
  handleKeyPress,
}: {
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSend: () => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
}) => {
  return (
    <Flex gap="4" align="center">
      <TextField.Root
        style={{ flexGrow: 1 }}
        autoComplete="off"
        placeholder="Enter message"
        size="3"
        onChange={handleInputChange}
        value={input}
        onKeyDown={handleKeyPress}
      />
      <IconButton
        style={{ flexShrink: 0 }}
        size="3"
        variant="solid"
        onClick={handleSend}
      >
        <PaperPlaneIcon />
      </IconButton>
    </Flex>
  );
};

export default MessageInput;
