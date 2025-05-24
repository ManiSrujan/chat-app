import { ISignUpFormData, signUpValidationRules } from "./validation";
import { IFormErrors, useFormValidation } from "../../hooks/useFormValidation";

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      // Form handling will be implemented later
      console.log("Form is valid", formData);
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
