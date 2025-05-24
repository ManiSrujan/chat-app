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
import { IChatUser } from "../chat.types";

const styles = {
  usersList: css`
    width: 300px;
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    overflow: auto;
  `,
  userItem: css`
    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `,
};

interface IChatListProps {
  users: IChatUser[];
  selectedUser?: IChatUser;
  onUserSelect: (user: IChatUser) => void;
}

const ChatList = ({ users, selectedUser, onUserSelect }: IChatListProps) => {
  return (
    <List className={styles.usersList}>
      {users.map((user: IChatUser) => (
        <Box key={user.userId}>
          <ListItem disablePadding className={styles.userItem}>
            <ListItemButton
              selected={selectedUser?.userId === user.userId}
              onClick={() => onUserSelect(user)}
            >
              <ListItemAvatar>
                <Avatar>{user.userName.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle1" component="span">
                      {user.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.lastMessageTime}
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
                    {user.lastMessage}
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
