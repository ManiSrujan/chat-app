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
} from "@mui/material";
import { css } from "@emotion/css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { IChat } from "../chat.types";
import { getLoggedUserId, getFullName } from "../../../common/utils/user";
import { getRelativeTime } from "../../../common/utils/date";
import { useState } from "react";
import { styled } from "@mui/system";

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

interface ChatListProps {
  chats: IChat[];
  selectedChat?: IChat;
  onChatSelect: (chat: IChat) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChat,
  onChatSelect,
}) => {
  const [searchText, setSearchText] = useState("");
  const currentUserId = getLoggedUserId();

  const getOtherUser = (chat: IChat) => {
    const user =
      chat.users.find((u) => u.user_id !== currentUserId) ?? chat.users[0];
    return user;
  };

  return (
    <Box className={styles.chatsList}>
      <Box className={styles.header}>
        <Box className={styles.headerActions}>
          <Typography className={styles.headerTitle}>Chats</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Add new chat">
              <StyledIconButton size="small">
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
    </Box>
  );
};

export default ChatList;
