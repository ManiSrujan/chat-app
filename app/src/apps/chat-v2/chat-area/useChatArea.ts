import { useState, useEffect } from "react";
import { IChatUser, IMessage } from "../chat.types";

interface IUseChatAreaReturn {
  message: string;
  messages: IMessage[];
  handleMessageChange: (value: string) => void;
  handleSend: () => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
}

export const useChatArea = (selectedUser?: IChatUser): IUseChatAreaReturn => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (selectedUser) {
      // This will be replaced with actual API call later
      setMessages([
        {
          id: "1",
          content: "Hey, how are you?",
          sender: "user1",
          timestamp: "10:30 AM",
        },
        {
          id: "2",
          content: "I'm good, thanks! How about you?",
          sender: "user2",
          timestamp: "10:31 AM",
        },
        {
          id: "3",
          content: "Great! Working on some new features.",
          sender: "user1",
          timestamp: "10:32 AM",
        },
        {
          id: "4",
          content: "That sounds interesting! Can you tell me more about it?",
          sender: "user2",
          timestamp: "10:33 AM",
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  const handleMessageChange = (value: string) => {
    setMessage(value);
  };

  const handleSend = () => {
    if (message.trim() && selectedUser) {
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
