import { useState, useEffect, useRef, useMemo } from "react";
import { IChat, IMessage } from "../chat.types";
import restClient from "../../../common/rest-client/restClient";
import { getEnvConfig } from "../../../common/env-config/envConfig";
import { ENV_CONFIG_KEY } from "../../../common/env-config/constants";
import websocket from "websocket";
import { getLoggedUserId, getLoggedUserName } from "src/common/user/user";
import useIntersectionObserver from "@/hooks/intersection-observer";
import debounce from "src/common/utils/debounce";
import throttle from "src/common/utils/throttle";

function scroll(
  scrollRef: React.MutableRefObject<HTMLDivElement | null>,
  top: number = 0,
) {
  if (scrollRef.current) {
    scrollRef.current.scrollTo({
      top,
      behavior: "auto",
    });
  }
}

function communicateIsTyping(
  client: websocket.w3cwebsocket | null,
  chatId: string,
  isTyping: boolean,
) {
  if (!client) {
    return;
  }

  client.send(
    JSON.stringify({
      type: "typing",
      data: { srcUserId: getLoggedUserId(), chatId, isTyping },
    }),
  );
}

const makeIsTypingTrue = throttle(
  (client: websocket.w3cwebsocket | null, chatId: string) => {
    communicateIsTyping(client, chatId, true);
  },
  1000,
);

const makeIsTypingFalse = debounce(
  (client: websocket.w3cwebsocket | null, chatId: string) => {
    communicateIsTyping(client, chatId, false);
  },
  1000,
);

export const useChatArea = (
  selectedChat: IChat | undefined,
  changeLastMessage: (chatId: string, lastMessage: IMessage) => void,
) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const scrolledHeight = useRef(0);

  function onIntersectionChange(isIntersecting: boolean) {
    if (isIntersecting) {
      if (scrollRef.current) {
        scrolledHeight.current = scrollRef.current.scrollHeight;
      }
      setPageNumber((pageNumber) => pageNumber + 1);
    }
  }

  const { intersectionRef } = useIntersectionObserver({
    isObservable: selectedChat?.chat_id,
    onIntersectionChange,
  });

  useMemo(
    function resetChatArea() {
      setLoading(false);
      setMessages([]);
      setPageNumber(0);
      setInput("");
    },
    [selectedChat?.chat_id],
  );

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
  }, [pageNumber]);

  useEffect(() => {
    if (scrollRef.current && !loading) {
      scroll(
        scrollRef,
        scrollRef.current.scrollHeight - scrolledHeight.current,
      );
    }
  }, [loading]);

  const handleInputChange = (
    client: websocket.w3cwebsocket | null,
    value: string,
  ) => {
    setInput(value);
    if (selectedChat) {
      makeIsTypingTrue(client, selectedChat.chat_id);
      makeIsTypingFalse(client, selectedChat.chat_id);
    }
  };

  function scrollToBottom() {
    // setTimeout is added to ensure that the scroll happens after the DOM updates
    setTimeout(() => {
      scroll(scrollRef, scrollRef.current?.scrollHeight);
    }, 0);
  }

  const addMessageToChat = (message: IMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    changeLastMessage(message.chat_id, message);
    scrollToBottom();
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
      communicateIsTyping(client, selectedChat.chat_id, false);

      const newMessage = {
        content: trimmedInput,
        created_at: new Date().toISOString(),
        message_id: "dummy-message-id",
        user_id: userId,
        user_name: userName,
        chat_id: selectedChat.chat_id,
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
    scrollToBottom,
  };
};

export default useChatArea;
