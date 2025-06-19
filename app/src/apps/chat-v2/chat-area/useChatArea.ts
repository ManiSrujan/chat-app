import { useState, useEffect } from "react";
import { IChat, IMessage } from "../chat.types";
import restClient from "../../../common/rest-client/restClient";
import { getEnvConfig } from "../../../common/env-config/envConfig";
import { ENV_CONFIG_KEY } from "../../../common/env-config/constants";
import websocket from "websocket";
import { getLoggedUserId, getLoggedUserName } from "../../../common/utils/user";

interface IUseChatAreaReturn {
  input: string;
  handleInputChange: (value: string) => void;
  handleSend: (client: websocket.w3cwebsocket | null) => void;
  handleKeyPress: (
    event: React.KeyboardEvent,
    client: websocket.w3cwebsocket | null,
  ) => void;
}

export const useChatArea = (
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>,
  setChats: React.Dispatch<React.SetStateAction<IChat[]>>,
  selectedChat: IChat | null | undefined,
): IUseChatAreaReturn => {
  const [input, setInput] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      try {
        if (selectedChat) {
          const response = await restClient.get<IMessage[]>(
            `${getEnvConfig(ENV_CONFIG_KEY.API)}/chat/${selectedChat.chat_id}/messages`,
          );
          setMessages(response.data);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchMessages();
  }, [selectedChat]);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleSend = (client: websocket.w3cwebsocket | null) => {
    if (!client) {
      return;
    }
    const trimmedInput = input.trim();
    const userId = getLoggedUserId();
    const userName = getLoggedUserName();

    if (trimmedInput && selectedChat && userId && userName) {
      client.send(
        JSON.stringify({
          type: "message",
          data: {
            srcUserId: getLoggedUserId(),
            chatId: selectedChat.chat_id,
            message: trimmedInput,
          },
        }),
      );

      const newMessage = {
        content: trimmedInput,
        created_at: new Date().toISOString(),
        message_id: "dummy-message-id",
        user_id: userId,
        user_name: userName,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.chat_id === selectedChat.chat_id
            ? {
                ...chat,
                last_message: newMessage,
              }
            : chat,
        ),
      );
    }

    setInput("");
  };

  const handleKeyPress = (
    event: React.KeyboardEvent,
    client: websocket.w3cwebsocket | null,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend(client);
    }
  };

  return {
    input,
    handleInputChange,
    handleSend,
    handleKeyPress,
  };
};

export default useChatArea;
