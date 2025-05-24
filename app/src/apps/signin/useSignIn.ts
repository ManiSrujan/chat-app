import { useLocation } from "wouter";
import { ISignInFormData, signInValidationRules } from "./validation";
import { IFormErrors, useFormValidation } from "../../hooks/useFormValidation";
import { ENV_CONFIG_KEY } from "../../common/env-config/constants";
import { getEnvConfig } from "../../common/env-config/envConfig";
import restClient from "../../common/rest-client/restClient";
import { getItem, setItem } from "../../common/local-storage/localStorage";
import { ILoginConfig, StorageKeys } from "../../common/types/storage.types";
import { useMemo } from "react";

interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
}
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

  useMemo(() => {
    const loginConfig = getItem<ILoginConfig>(StorageKeys.LOGIN_CONFIG);

    if (loginConfig && loginConfig.accessToken) {
      // If user is already logged in, redirect to chat
      setLocation("/chat");
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await restClient.post<ILoginResponse>(
          `${getEnvConfig(ENV_CONFIG_KEY.API)}/auth/login`,
          {
            username: formData.username,
            password: formData.password,
          },
        );
        const { accessToken, refreshToken, userId, userName } = response.data;

        // Store tokens and user info
        setItem(StorageKeys.LOGIN_CONFIG, {
          accessToken,
          refreshToken,
          userId,
          userName,
        });

        // Redirect to chat
        setLocation("/chat");
      } catch (error) {
        // TODO: Add a notification component that displays error later
        console.error("Login failed:", error);
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
