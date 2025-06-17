import { useState, useEffect } from "react";
import { IChat } from "../chat.types";
import restClient from "../../../common/rest-client/restClient";
import { getEnvConfig } from "../../../common/env-config/envConfig";
import { ENV_CONFIG_KEY } from "../../../common/env-config/constants";
import { getLoggedUserId } from "../../../common/utils/user";

interface IUseChatListReturn {
  chats: IChat[];
  selectedChat: IChat | undefined;
  handleChatSelect: (chat: IChat) => void;
  loading: boolean;
  error: string | null;
  setChats: React.Dispatch<React.SetStateAction<IChat[]>>;
}

const useChatList = (): IUseChatListReturn => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<IChat>();
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    async function getChats() {
      try {
        const response = await restClient.get<IChat[]>(
          `${getEnvConfig(ENV_CONFIG_KEY.API)}/user/${getLoggedUserId()}/chats`,
        );
        setChats(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getChats();
  }, []);

  const handleChatSelect = (chat: IChat) => {
    setSelectedChat(chat);
  };

  return {
    chats,
    selectedChat,
    handleChatSelect,
    loading,
    error,
    setChats,
  };
};

export default useChatList;
