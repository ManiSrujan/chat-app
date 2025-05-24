import { useLocation } from "wouter";
import { SignInForm } from "./components/SignInForm";
import { ISignInFormData, signInValidationRules } from "./validation";
import { useFormValidation } from "../../hooks/useFormValidation";
import { ENV_CONFIG_KEY } from "../../common/env-config/constants";
import { getEnvConfig } from "../../common/env-config/envConfig";
import restClient from "../../common/rest-client/restClient";

const initialData: ISignInFormData = {
  username: "",
  password: "",
};

const SignIn = () => {
  const [, setLocation] = useLocation();
  const { formData, formErrors, handleChange, handleBlur, validateForm } =
    useFormValidation<ISignInFormData>(initialData, signInValidationRules);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await restClient.post(
          `${getEnvConfig(ENV_CONFIG_KEY.API)}/auth/login`,
          formData,
        );
        const { accessToken, refreshToken, userId, userName } = response.data;

        // Store tokens and user info
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName);

        // Redirect to chat
        setLocation("/chat");
      } catch (error) {
        console.error("Login failed:", error);
        // TODO: Handle login errors properly
      }
    }
  };

  return (
    <SignInForm
      formData={formData}
      formErrors={formErrors}
      handleChange={handleChange}
      handleBlur={handleBlur}
      handleSubmit={handleSubmit}
    />
  );
};

export default SignIn;
