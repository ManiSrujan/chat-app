import {
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { css } from "@emotion/css";
import { IChat } from "../chat.types";
import { getFullName, getLoggedUserId } from "../../../common/utils/user";
import { getRelativeTime } from "../../../common/utils/date";

const styles = {
  chatsList: css`
    width: 300px;
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    overflow: auto;
  `,
  chatItem: css`
    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `,
};

interface IChatListProps {
  chats: IChat[];
  selectedChat?: IChat;
  onChatSelect: (chat: IChat) => void;
}

const ChatList = ({ chats, selectedChat, onChatSelect }: IChatListProps) => {
  return (
    <List className={styles.chatsList}>
      {chats.map((chat: IChat) => (
        <Box key={chat.chat_id}>
          <ListItem disablePadding className={styles.chatItem}>
            <ListItemButton
              selected={selectedChat?.chat_id === chat.chat_id}
              onClick={() => onChatSelect(chat)}
            >
              <ListItemAvatar>
                <Avatar>{chat.users[0].first_name.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle1" component="span">
                      {getFullName(
                        chat.users[0].first_name,
                        chat.users[0].last_name,
                      )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
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
                    }}
                  >
                    {chat.last_message.user_id === getLoggedUserId()
                      ? "You: "
                      : ""}
                    {chat.last_message.content}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
          <Divider />
        </Box>
      ))}
    </List>
  );
};

export default ChatList;
