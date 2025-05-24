import { useLocation } from "wouter";
import { ISignInFormData, signInValidationRules } from "./validation";
import { IFormErrors, useFormValidation } from "../../hooks/useFormValidation";
import { ENV_CONFIG_KEY } from "../../common/env-config/constants";
import { getEnvConfig } from "../../common/env-config/envConfig";
import restClient from "../../common/rest-client/restClient";

interface IUseSignInReturn {
  formData: ISignInFormData;
  formErrors: IFormErrors;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const initialData: ISignInFormData = {
  username: "",
  password: "",
};

const useSignIn = (): IUseSignInReturn => {
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

  return {
    formData,
    formErrors,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};

export default useSignIn;
