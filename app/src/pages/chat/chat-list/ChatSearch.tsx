import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";

const ChatSearch = (): JSX.Element => {
  return (
    <TextField.Root autoComplete="off" placeholder="search chats">
      <TextField.Slot>
        <MagnifyingGlassIcon />
      </TextField.Slot>
    </TextField.Root>
  );
};

export default ChatSearch;
