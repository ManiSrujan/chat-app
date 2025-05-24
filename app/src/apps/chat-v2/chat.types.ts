export interface IUser {
  user_id: string;
  user_name: string;
  first_name: string;
  last_name: string;
}

export interface IChatUser {
  userId: string;
  userName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline?: boolean;
}

export interface IMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

export interface IChatV2Props {
  users: IChatUser[];
  selectedUser?: IChatUser;
  onUserSelect: (user: IChatUser) => void;
}
