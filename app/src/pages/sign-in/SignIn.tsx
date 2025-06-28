import FormField from "@form-field";
import { Box, Button, Card, Flex, Heading, Link } from "@radix-ui/themes";
import { Routes } from "src/common/constants";
import useSignIn from "./useSignIn";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

const SignIn = (): JSX.Element => {
  const { formData, refs, onChange, onSubmit, passwordType, setPasswordType } =
    useSignIn();

  return (
    <Flex align="center" justify="center" height="100%">
      <Box width="400px">
        <Card size="4">
          <Heading as="h3" mb="6">
            Sign In
          </Heading>
          <Flex direction="column" gap="4">
            <FormField
              label="Username"
              placeholder="Enter your username"
              value={formData.username.value}
              error={formData.username.error}
              ref={(ref) => (refs.current.username = ref)}
              onChange={(event) => onChange("username", event)}
              required
            />
            <FormField
              label="Password"
              placeholder="Enter your password"
              type={passwordType}
              value={formData.password.value}
              error={formData.password.error}
              ref={(ref) => (refs.current.password = ref)}
              onChange={(event) => onChange("password", event)}
              icon={
                passwordType === "password" ? (
                  <EyeClosedIcon />
                ) : (
                  <EyeOpenIcon />
                )
              }
              onIconClick={() =>
                setPasswordType(
                  passwordType === "password" ? "text" : "password",
                )
              }
              required
            />
            <Button size="3" variant="solid" mt="3" onClick={onSubmit}>
              Sign In
            </Button>
            <Link size="1" href={Routes.SignUp}>
              Dont have an account? Sign Up
            </Link>
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
};

export default SignIn;
