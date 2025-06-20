import {
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  InputBase,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import { css } from "@emotion/css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { IChat, IUser } from "../chat.types";
import { getLoggedUserId, getFullName } from "../../../common/utils/user";
import { getRelativeTime } from "../../../common/utils/date";
import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import restClient from "../../../common/rest-client/restClient";
import { getEnvConfig } from "../../../common/env-config/envConfig";
import { ENV_CONFIG_KEY } from "../../../common/env-config/constants";

const StyledIconButton = styled(IconButton)({
  color: "rgba(255, 255, 255, 0.7)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    color: "#36B37E",
    transform: "translateY(-1px)",
  },
});

const styles = {
  chatsList: css`
    background-color: #121214;
    min-width: 280px;
    max-width: 380px;
    width: 30%;
    border-right: 1px solid rgba(255, 255, 255, 0.12);
    display: flex;
    flex-direction: column;
    height: 100%;

    @media (max-width: 600px) {
      width: 100%;
      max-width: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
    }
  `,
  header: css`
    padding: 8px 12px;
    background-color: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
  `,
  headerActions: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  `,
  headerTitle: css`
    color: #fff;
    font-size: 0.9rem;
    font-weight: 600;
  `,
  searchArea: css`
    display: flex;
    align-items: center;
  `,
  listContainer: css`
    flex-grow: 1;
    overflow-y: auto;
    padding: 8px 0;

    @media (max-width: 600px) {
      height: calc(100vh - 120px); // Account for header and search
    }

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `,
  userName: css`
    color: #fff;
    font-weight: 600;
    font-size: 0.75rem;
  `,
  lastMessage: css`
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 180px;
  `,
  time: css`
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem !important;
    white-space: nowrap;
    opacity: 0.8;
  `,
};

const NewChatDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
  },
  "& .MuiDialogTitle-root": {
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  "& .MuiDialogContent-root": {
    paddingTop: "20px !important",
  },
}));

const SearchUserField = styled(TextField)({
  "& .MuiInputBase-root": {
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: "10px",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid rgba(255, 255, 255, 0.12)",
  },
  "& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  "& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#36B37E",
  },
});

const UserListItem = styled(ListItem)({
  borderRadius: "8px",
  marginBottom: "4px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
});

interface ChatListProps {
  chats: IChat[];
  selectedChat: IChat | undefined;
  onChatSelect: (chat: IChat) => void;
  setChats: React.Dispatch<React.SetStateAction<IChat[]>>;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChat,
  onChatSelect,
  setChats,
}) => {
  const [searchText, setSearchText] = useState("");
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [userSearchText, setUserSearchText] = useState("");
  const [availableUsers, setAvailableUsers] = useState<IUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const currentUserId = getLoggedUserId();

  useEffect(() => {
    if (isNewChatDialogOpen) {
      fetchAvailableUsers();
    }
  }, [isNewChatDialogOpen]);

  const fetchAvailableUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await restClient.get<IUser[]>(
        `${getEnvConfig(ENV_CONFIG_KEY.API)}/users`,
      );
      setAvailableUsers(
        response.data.filter((user) => user.user_id !== currentUserId),
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleNewChatClick = () => {
    setIsNewChatDialogOpen(true);
  };

  const handleNewChatClose = () => {
    setIsNewChatDialogOpen(false);
    setUserSearchText("");
  };

  const handleUserClick = async (user: IUser) => {
    try {
      const response = await restClient.post(
        `${getEnvConfig(ENV_CONFIG_KEY.API)}/chat`,
        {
          srcUser: currentUserId,
          targetUser: user.user_id,
        },
      );

      const chatId = response.data.chatId;
      const newChat: IChat = {
        chat_id: chatId,
        users: [user],
        last_message: {
          message_id: "",
          user_id: "",
          user_name: "",
          content: "",
          created_at: new Date().toISOString(),
        },
      };

      setChats((prevChats) => {
        // Check if chat already exists
        if (!prevChats.some((chat) => chat.chat_id === chatId)) {
          return [...prevChats, newChat];
        }
        return prevChats;
      });

      handleNewChatClose();
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const getOtherUser = (chat: IChat) => {
    const user =
      chat.users.find((u) => u.user_id !== currentUserId) ?? chat.users[0];
    return user;
  };

  const filteredUsers = availableUsers.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(userSearchText.toLowerCase()),
  );

  return (
    <Box className={styles.chatsList}>
      <Box className={styles.header}>
        <Box className={styles.headerActions}>
          <Typography className={styles.headerTitle}>Chats</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Add new chat">
              <StyledIconButton size="small" onClick={handleNewChatClick}>
                <PersonAddAltRoundedIcon />
              </StyledIconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <StyledIconButton size="small">
                <TuneRoundedIcon />
              </StyledIconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              transform: "translateY(-1px)",
            },
            "&:focus-within": {
              borderColor: "#36B37E",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(54, 179, 126, 0.1)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", px: 1 }}>
            <InputBase
              placeholder="Search chats..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              startAdornment={
                <SearchRoundedIcon
                  sx={{ mr: 1, opacity: 0.7, fontSize: "1.1rem" }}
                />
              }
              sx={{
                color: "#fff",
                width: "100%",
                padding: "6px 0px",
                fontSize: "0.75rem",
                "& input::placeholder": {
                  color: "rgba(255, 255, 255, 0.5)",
                  opacity: 1,
                  fontSize: "0.75rem",
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      <List className={styles.listContainer}>
        {chats.map((chat) => {
          const otherUser = getOtherUser(chat);
          const userName = getFullName(
            otherUser.first_name,
            otherUser.last_name,
          );
          const avatarText =
            `${otherUser.first_name[0]}${otherUser.last_name[0]}`.toUpperCase();

          return (
            <ListItem key={chat.chat_id} disablePadding>
              <ListItemButton
                selected={selectedChat?.chat_id === chat.chat_id}
                onClick={() => onChatSelect(chat)}
                sx={{
                  display: "flex",
                  gap: "12px",
                  margin: "2px 8px",
                  borderRadius: "10px",
                  padding: "4px 8px",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    transform: "translateY(-1px)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(54, 179, 126, 0.15)",
                    border: "1px solid rgba(54, 179, 126, 0.2)",
                    "&:hover": {
                      backgroundColor: "rgba(54, 179, 126, 0.2)",
                    },
                  },
                }}
              >
                <ListItemAvatar sx={{ minWidth: 0 }}>
                  <Avatar
                    sx={{
                      backgroundColor: "#36B37E",
                      width: 32,
                      height: 32,
                      fontSize: "0.8rem",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    {avatarText}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography className={styles.userName}>
                      {userName}
                    </Typography>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography className={styles.lastMessage}>
                        {chat.last_message?.content || "No messages yet"}
                      </Typography>
                      {chat.last_message && (
                        <Typography className={styles.time}>
                          {getRelativeTime(
                            new Date(chat.last_message.created_at),
                            new Date(),
                          )}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <NewChatDialog open={isNewChatDialogOpen} onClose={handleNewChatClose}>
        <DialogTitle>New Chat</DialogTitle>
        <DialogContent>
          <SearchUserField
            fullWidth
            placeholder="Search users..."
            value={userSearchText}
            onChange={(e) => setUserSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchRoundedIcon
                  sx={{ mr: 1, color: "rgba(255, 255, 255, 0.5)" }}
                />
              ),
            }}
          />
          {loadingUsers ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <CircularProgress sx={{ color: "#36B37E" }} />
            </Box>
          ) : (
            <List sx={{ mt: 2 }}>
              {filteredUsers.map((user) => (
                <UserListItem
                  key={user.user_id}
                  onClick={() => handleUserClick(user)}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background:
                          "linear-gradient(45deg, #36B37E 30%, #2C9066 90%)",
                      }}
                    >
                      {`${user.first_name[0]}${user.last_name[0]}`.toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: "#fff" }}>
                        {`${user.first_name} ${user.last_name}`}
                      </Typography>
                    }
                  />
                </UserListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </NewChatDialog>
    </Box>
  );
};

export default ChatList;
