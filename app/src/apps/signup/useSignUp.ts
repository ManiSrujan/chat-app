import { ISignUpFormData, signUpValidationRules } from "./validation";
import { IFormErrors, useFormValidation } from "../../hooks/useFormValidation";
import restClient from "../../common/rest-client/restClient";
import { getEnvConfig } from "../../common/env-config/envConfig";
import { ENV_CONFIG_KEY } from "../../common/env-config/constants";
import { useLocation } from "wouter";

interface IUseSignUpReturn {
  formData: ISignUpFormData;
  formErrors: IFormErrors;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const initialData: ISignUpFormData = {
  firstname: "",
  lastname: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const useSignUp = (): IUseSignUpReturn => {
  const { formData, formErrors, handleChange, handleBlur, validateForm } =
    useFormValidation<ISignUpFormData>(initialData, signUpValidationRules);
  const [, setLocation] = useLocation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await restClient.post<void>(
          `${getEnvConfig(ENV_CONFIG_KEY.API)}/auth/signup`,
          {
            firstname: formData.firstname,
            lastname: formData.lastname,
            username: formData.username,
            password: formData.password,
          },
        );
        setLocation("/"); // Redirect to login page after successful sign-up
      } catch (error) {
        // TODO: Add a notification component to show errors
        console.error("Sign up failed:", error);
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

export default useSignUp;
