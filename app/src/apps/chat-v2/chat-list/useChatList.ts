import { useState, useEffect } from "react";
import { IChatUser } from "../chat.types";

interface IUseChatListReturn {
  users: IChatUser[];
  selectedUser: IChatUser | undefined;
  handleUserSelect: (user: IChatUser) => void;
  loading: boolean;
  error: string | null;
}

const useChatList = (): IUseChatListReturn => {
  const [users, setUsers] = useState<IChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IChatUser>();
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // For now using dummy data - will be replaced with API integration
    setUsers([
      {
        userId: "1",
        userName: "John Doe",
        lastMessage: "Hey, how are you?",
        lastMessageTime: "10:30 AM",
        isOnline: true,
      },
      {
        userId: "2",
        userName: "Jane Smith",
        lastMessage: "Can we meet tomorrow?",
        lastMessageTime: "Yesterday",
        isOnline: false,
      },
      {
        userId: "3",
        userName: "Mike Johnson",
        lastMessage: "The project is ready",
        lastMessageTime: "2 days ago",
        isOnline: true,
      },
    ]);
    setLoading(false);
  }, []);

  const handleUserSelect = (user: IChatUser) => {
    setSelectedUser(user);
  };

  return {
    users,
    selectedUser,
    handleUserSelect,
    loading,
    error,
  };
};

export default useChatList;
