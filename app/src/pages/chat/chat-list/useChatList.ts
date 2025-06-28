import { useState, useEffect } from "react";
import restClient from "../../../common/rest-client/restClient";
import { getEnvConfig } from "../../../common/env-config/envConfig";
import { ENV_CONFIG_KEY } from "../../../common/env-config/constants";
import { getLoggedUserId } from "src/common/user/user";
import { IChat, IMessage } from "../chat.types";

interface IUseChatListReturn {
  chats: IChat[];
  selectedChat: IChat | undefined;
  loading: boolean;
  error: string | null;
  handleChatSelect: (chat: IChat) => void;
  changeLastMessage: (chatId: string, lastMessage: IMessage) => void;
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

  const changeLastMessage = (chatId: string, lastMessage: IMessage) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chat_id === chatId
          ? {
              ...chat,
              last_message: lastMessage,
            }
          : chat,
      ),
    );
  };

  return {
    chats,
    selectedChat,
    loading,
    error,
    handleChatSelect,
    changeLastMessage,
  };
};

export default useChatList;
