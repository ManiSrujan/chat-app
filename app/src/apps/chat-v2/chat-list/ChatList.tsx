import {
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  Badge,
  styled,
  InputBase,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { css } from "@emotion/css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { IChat } from "../chat.types";
import {
  getAvatarName,
  getFullName,
  getLoggedUserId,
} from "../../../common/utils/user";
import { getRelativeTime } from "../../../common/utils/date";
import { useState } from "react";

// Styled components
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-dot": {
    backgroundColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    width: 12,
    height: 12,
    borderRadius: "50%",
  },
}));

const SearchBar = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.background.default,
  marginBottom: theme.spacing(1),
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.text.secondary,
  },
  "&:focus-within": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper,
  },
}));

const ActionChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: 6,
  height: 32,
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.text.secondary,
  },
  "& .MuiChip-label": {
    paddingLeft: 8,
    paddingRight: 8,
  },
}));

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
    }
  `,
  header: css`
    padding: 12px;
    background-color: #1a1a1e;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  `,
  headerActions: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  `,
  headerRight: css`
    display: flex;
    gap: 8px;
    align-items: center;
  `,
  listContainer: css`
    flex: 1;
    overflow: auto;

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;
    scrollbar-width: thin;

    /* Custom scrollbar styles */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: 3px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
  `,
  chatItemButton: css`
    padding: 8px 12px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.04);
    }
  `,
  searchInput: css`
    width: 100%;
    padding: 6px 12px;
    padding-right: 36px;
    color: inherit;
    font-size: 0.85rem;
  `,
  actionButton: css`
    padding: 6px;
    color: rgba(255, 255, 255, 0.7);
    &:hover {
      color: rgba(255, 255, 255, 0.9);
    }
  `,
  filterChip: css`
    transition: all 0.2s ease;
  `,
};

interface IChatListProps {
  chats: IChat[];
  selectedChat?: IChat;
  onChatSelect: (chat: IChat) => void;
}

const ChatList = ({ chats, selectedChat, onChatSelect }: IChatListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    const fullName = getFullName(
      chat.users[0].first_name,
      chat.users[0].last_name,
    ).toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <Box className={styles.chatsList}>
      <Box className={styles.header}>
        <Box className={styles.headerActions}>
          <Typography variant="h6" fontWeight={500}>
            Direct Messages
          </Typography>
          <Box className={styles.headerRight}>
            {" "}
            <Tooltip title="New chat">
              <IconButton
                size="small"
                color="primary"
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(54, 179, 126, 0.08)",
                  },
                }}
              >
                <PersonAddAltRoundedIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter">
              <IconButton
                size="small"
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                <TuneRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <SearchBar>
          <InputBase
            className={styles.searchInput}
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputProps={{ "aria-label": "search chats" }}
          />
          <IconButton
            className={styles.actionButton}
            sx={{
              position: "absolute",
              right: 4,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {" "}
            <SearchRoundedIcon
              sx={{
                fontSize: 18,
                color: (theme) => theme.palette.text.secondary,
              }}
            />
          </IconButton>
        </SearchBar>
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <ActionChip
            className={styles.filterChip}
            label="All"
            size="small"
            onClick={() => setActiveFilter("all")}
            color={activeFilter === "all" ? "primary" : "default"}
            variant={activeFilter === "all" ? "filled" : "outlined"}
          />
          <ActionChip
            className={styles.filterChip}
            label="Unread"
            size="small"
            onClick={() => setActiveFilter("unread")}
            color={activeFilter === "unread" ? "primary" : "default"}
            variant={activeFilter === "unread" ? "filled" : "outlined"}
          />
        </Box>
      </Box>

      <List className={styles.listContainer} disablePadding>
        {filteredChats.map((chat: IChat) => {
          const isOnline = Math.random() < 0.5; // This should be replaced with actual online status
          return (
            <ListItem key={chat.chat_id} disablePadding divider>
              <ListItemButton
                selected={selectedChat?.chat_id === chat.chat_id}
                onClick={() => onChatSelect(chat)}
                className={styles.chatItemButton}
              >
                <ListItemAvatar>
                  <StyledBadge
                    variant="dot"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    invisible={!isOnline}
                    overlap="circular"
                  >
                    {" "}
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        color: "#fff",
                        width: 40,
                        height: 40,
                        fontSize: "0.95rem",
                      }}
                    >
                      {getAvatarName(
                        chat.users[0].first_name,
                        chat.users[0].last_name,
                      )}
                    </Avatar>
                  </StyledBadge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      {" "}
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "0.9rem",
                          lineHeight: 1.3,
                        }}
                        fontWeight={500}
                        component="span"
                      >
                        {getFullName(
                          chat.users[0].first_name,
                          chat.users[0].last_name,
                        )}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {getRelativeTime(
                          new Date(chat.last_message.created_at),
                          new Date(),
                        )}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "90%",
                        fontSize: "0.8rem",
                        lineHeight: 1.4,
                        mt: "2px",
                      }}
                    >
                      {chat.last_message.user_id === getLoggedUserId() && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "inherit" }}
                        >
                          You:{" "}
                        </Typography>
                      )}
                      {chat.last_message.content}
                    </Typography>
                  }
                  sx={{ margin: 0 }}
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
