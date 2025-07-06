import { useEffect, useState } from "react";
import debounce from "src/common/utils/debounce";
import restClient from "src/common/rest-client/restClient";
import { ENV_CONFIG_KEY } from "src/common/env-config/constants";
import { getEnvConfig } from "src/common/env-config/envConfig";
import { getLoggedUserId } from "src/common/user/user";

interface IUser {
  first_name: string;
  last_name: string;
  user_id: string;
  user_name: string;
}

// TODO: Add pagination support to fetching users
const fetchUsers = debounce(async (search: string): Promise<IUser[]> => {
  try {
    const response = await restClient.get<IUser[]>(
      `${getEnvConfig(ENV_CONFIG_KEY.API)}/users?search=${search}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
});

const useUserSearch = () => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [open, setOpen] = useState(false);

  async function searchUsers(value: string) {
    const response = await fetchUsers(value);
    setUsers(response.filter((user) => user.user_id !== getLoggedUserId()));
  }

  useEffect(() => {
    if (open) {
      searchUsers("");
    }
  }, [open]);

  function handleInputChange(value: string) {
    setInput(value);
    searchUsers(value);
  }

  function onOpenChange(value: boolean) {
    setOpen(value);
  }

  return {
    input,
    users,
    open,
    onOpenChange,
    handleInputChange,
  };
};

export default useUserSearch;
