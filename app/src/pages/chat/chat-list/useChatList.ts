import { useState, useEffect } from "react";
import restClient from "../../../common/rest-client/restClient";
import { getEnvConfig } from "../../../common/env-config/envConfig";
import { ENV_CONFIG_KEY } from "../../../common/env-config/constants";
import { getLoggedUserId } from "src/common/user/user";
import { IChat, IMessage } from "../chat.types";

const useChatList = () => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<IChat>();
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  async function getChats() {
    try {
      const response = await restClient.get<IChat[]>(
        `${getEnvConfig(ENV_CONFIG_KEY.API)}/user/${getLoggedUserId()}/chats`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      setChats(await getChats());
    })();
  }, []);

  const handleChatSelect = (chat: IChat | undefined) => {
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

  async function createChat(srcUserId: string, targetUserId: string) {
    try {
      const response = await restClient.post<{ chatId: string }>(
        `${getEnvConfig(ENV_CONFIG_KEY.API)}/chat`,
        {
          srcUser: srcUserId,
          targetUser: targetUserId,
        },
      );
      const updatedChats = await getChats();
      setChats(updatedChats);
      setSelectedChat(
        updatedChats.find((chat) => chat.chat_id === response.data.chatId),
      );
    } catch (error) {
      console.error(error);
    }
  }

  function addIsTypingToChat(chatId: string, isTyping: boolean) {
    setSelectedChat((prevChat) =>
      prevChat
        ? {
            ...prevChat,
            _isTyping:
              prevChat.chat_id === chatId ? isTyping : prevChat._isTyping,
          }
        : prevChat,
    );
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chat_id === chatId
          ? {
              ...chat,
              _isTyping: isTyping,
            }
          : chat,
      ),
    );
  }

  return {
    chats,
    selectedChat,
    loading,
    error,
    handleChatSelect,
    changeLastMessage,
    createChat,
    addIsTypingToChat,
  };
};

export default useChatList;
