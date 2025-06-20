export interface IUser {
  user_id: string;
  first_name: string;
  last_name: string;
}

export interface IChat {
  chat_id: string;
  users: IUser[];
  last_message: {
    message_id: string;
    user_id: string;
    user_name: string;
    content: string;
    created_at: string;
  };
}

export interface IMessage {
  message_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_name: string;
}

export interface IChatV2Props {
  chats: IChat[];
  selectedChat?: IChat;
  onChatSelect: (chat: IChat) => void;
  setChats: React.Dispatch<React.SetStateAction<IChat[]>>;
}
