import { Avatar, Box, Flex, Text } from "@radix-ui/themes";
import { getAvatarName, getFullName } from "src/common/user/user";

const UserCard = ({
  firstName,
  lastName,
  description,
}: {
  firstName: string;
  lastName: string;
  description?: string;
}): JSX.Element => {
  return (
    <Flex gap="4" align="center">
      <Avatar fallback={getAvatarName(firstName, lastName)} radius="full" />
      <Box>
        <Text as="div" size="2" weight="medium">
          {getFullName(firstName, lastName)}
        </Text>
        {description ? (
          <Text
            as="div"
            size="1"
            color="gray"
            wrap="nowrap"
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              width: "200px",
            }}
          >
            {description}
          </Text>
        ) : null}
      </Box>
    </Flex>
  );
};

export default UserCard;
