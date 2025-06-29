import { Avatar, DropdownMenu, IconButton } from "@radix-ui/themes";
import { Routes } from "src/common/constants";
import { clearLS } from "src/common/local-storage/localStorage";
import { getAvatarName, getFirstName, getLastName } from "src/common/user/user";
import { useLocation } from "wouter";

const Profile = (): JSX.Element => {
  const [, setLocation] = useLocation();

  function logout() {
    clearLS();
    setLocation(Routes.SignIn);
  }

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger>
        <IconButton radius="full" variant="ghost">
          <Avatar
            fallback={getAvatarName(getFirstName() ?? "", getLastName() ?? "")}
          />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={logout}>Logout</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default Profile;
