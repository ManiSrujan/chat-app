import { useState, useEffect, useRef } from "react";
import { IChat, IMessage } from "../chat.types";
import restClient from "../../../common/rest-client/restClient";
import { getEnvConfig } from "../../../common/env-config/envConfig";
import { ENV_CONFIG_KEY } from "../../../common/env-config/constants";
import websocket from "websocket";
import { getLoggedUserId, getLoggedUserName } from "src/common/user/user";
import useIntersectionObserver from "src/hooks/intersection-observer";

interface IUseChatAreaReturn {
  input: string;
  messages: IMessage[];
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  loading: boolean;
  intersectionRef: React.RefObject<HTMLDivElement>;
  handleInputChange: (value: string) => void;
  handleSend: (client: websocket.w3cwebsocket | null) => void;
  handleKeyPress: (
    event: React.KeyboardEvent,
    client: websocket.w3cwebsocket | null,
  ) => void;
  addMessageToChat: (message: IMessage) => void;
}

export const useChatArea = (
  selectedChat: IChat | undefined,
  changeLastMessage: (chatId: string, lastMessage: IMessage) => void,
): IUseChatAreaReturn => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const scrolledHeight = useRef(0);

  const { intersectionRef, isIntersecting } = useIntersectionObserver({
    isObservable: selectedChat?.chat_id,
  });

  useEffect(() => {
    if (isIntersecting) {
      if (scrollRef.current) {
        scrolledHeight.current = scrollRef.current.scrollHeight;
      }
      setPageNumber(pageNumber + 1);
    }
  }, [isIntersecting]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true);
        if (!selectedChat || !pageNumber) {
          return;
        }
        const response = await restClient.get<IMessage[]>(
          `${getEnvConfig(ENV_CONFIG_KEY.API)}/chat/${selectedChat.chat_id}/messages?pageNumber=${pageNumber}&pageSize=25`,
        );
        setMessages([...response.data.reverse(), ...messages]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [selectedChat, pageNumber]);

  useEffect(() => {
    if (scrollRef.current && !loading) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight - scrolledHeight.current,
        behavior: "auto",
      });
    }
  }, [loading]);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const addMessageToChat = (message: IMessage) => {
    if (!selectedChat) {
      return;
    }
    setMessages((prevMessages) => [...prevMessages, message]);
    changeLastMessage(selectedChat.chat_id, message);
    // setTimeout is added to get new scrollHeight after addming message to DOM
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "auto",
        });
      }
    }, 0);
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
      addMessageToChat(newMessage);
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
    messages,
    scrollRef,
    loading,
    intersectionRef,
    handleInputChange,
    handleSend,
    handleKeyPress,
    addMessageToChat,
  };
};

export default useChatArea;
