import { Box, Button, Card, Flex, Heading, Link } from "@radix-ui/themes";
import FormField from "@form-field";
import useSignUp from "./useSignUp";
import { Routes } from "src/common/constants";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Link as WouterLink } from "wouter";

const SignUp = (): JSX.Element => {
  const {
    formData,
    onChange,
    onSubmit,
    refs,
    passwordType,
    setPasswordType,
    confirmPasswordType,
    setConfirmPasswordType,
    handleKeyPress,
  } = useSignUp();

  return (
    <Flex align="center" justify="center" height="100%">
      <Box width="400px" p={{ initial: "4", md: "0" }}>
        <Card size="4">
          <Heading as="h3" mb="6">
            Sign Up
          </Heading>
          <Flex direction="column" gap="4">
            <FormField
              label="First Name"
              placeholder="Enter your first name"
              value={formData.firstName.value}
              error={formData.firstName.error}
              ref={(ref) => (refs.current.firstName = ref)}
              autoFocus
              onChange={(event) => onChange("firstName", event)}
              required
            />
            <FormField
              label="Last Name"
              placeholder="Enter your last name"
              value={formData.lastName.value}
              error={formData.lastName.error}
              ref={(ref) => (refs.current.lastName = ref)}
              onChange={(event) => onChange("lastName", event)}
              required
            />
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
            <FormField
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword.value}
              error={formData.confirmPassword.error}
              ref={(ref) => (refs.current.confirmPassword = ref)}
              type={confirmPasswordType}
              onChange={(event) => onChange("confirmPassword", event)}
              icon={
                confirmPasswordType === "password" ? (
                  <EyeClosedIcon />
                ) : (
                  <EyeOpenIcon />
                )
              }
              onIconClick={() =>
                setConfirmPasswordType(
                  confirmPasswordType === "password" ? "text" : "password",
                )
              }
              required
            />
            <Button
              size="3"
              variant="solid"
              mt="3"
              onClick={onSubmit}
              onKeyDown={handleKeyPress}
            >
              Sign Up
            </Button>
            <Flex justify="between">
              <Link size="1" href="#">
                Forgot Password?
              </Link>
              <WouterLink href={Routes.SignIn}>
                <Link size="1" href={Routes.SignIn}>
                  Already have an account? Sign In
                </Link>
              </WouterLink>
            </Flex>
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
};

export default SignUp;
