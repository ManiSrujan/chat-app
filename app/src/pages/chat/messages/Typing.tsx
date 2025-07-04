import { Flex } from "@radix-ui/themes";

const Typing = ({ show }: { show?: boolean }) => {
  return show ? (
    <Flex className="typing" gap="1" align="center">
      <span></span>
      <span></span>
      <span></span>
    </Flex>
  ) : null;
};

export default Typing;
