import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import {
  Card,
  Flex,
  IconButton,
  Popover,
  ScrollArea,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import useUserSearch from "./useUserSearch";
import UserCard from "@user-card";
import { getLoggedUserId } from "src/common/user/user";

const UserSearch = ({
  onUserSelect,
}: {
  onUserSelect: (srcUserId: string, targetUserId: string) => Promise<void>;
}): JSX.Element => {
  const { input, handleInputChange, users, open, onOpenChange } =
    useUserSearch();

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger>
        <IconButton size="1" variant="soft">
          <Tooltip content="Add users to converse">
            <PlusIcon />
          </Tooltip>
        </IconButton>
      </Popover.Trigger>

      <Popover.Content width="312px">
        <Flex direction="column" gap="3">
          <TextField.Root
            value={input}
            placeholder="search users"
            onChange={(e) => handleInputChange(e.target.value)}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
          </TextField.Root>
          <ScrollArea style={{ maxHeight: "500px" }}>
            <Flex direction="column" gap="2">
              {users.map((user) => (
                <Card
                  size="1"
                  variant="classic"
                  key={user.user_id}
                  onClick={() => {
                    onUserSelect(getLoggedUserId() ?? "", user.user_id);
                    onOpenChange(false);
                  }}
                >
                  <UserCard
                    firstName={user.first_name}
                    lastName={user.last_name}
                    description={user.user_name}
                  />
                </Card>
              ))}
            </Flex>
          </ScrollArea>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

export default UserSearch;
