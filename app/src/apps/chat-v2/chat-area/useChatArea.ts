import { useState, useEffect } from "react";
import { IChat, IMessage } from "../chat.types";
import restClient from "../../../common/rest-client/restClient";
import { getEnvConfig } from "../../../common/env-config/envConfig";
import { ENV_CONFIG_KEY } from "../../../common/env-config/constants";

interface IUseChatAreaReturn {
  message: string;
  messages: IMessage[];
  handleMessageChange: (value: string) => void;
  handleSend: () => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
}

export const useChatArea = (selectedChat?: IChat): IUseChatAreaReturn => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);

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

  const handleMessageChange = (value: string) => {
    setMessage(value);
  };

  const handleSend = () => {
    if (message.trim() && selectedChat) {
      // Here we'll add the logic to send the message
      // For now, just clear the input
      setMessage("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return {
    message,
    messages,
    handleMessageChange,
    handleSend,
    handleKeyPress,
  };
};

export default useChatArea;
