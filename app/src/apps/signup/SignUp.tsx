import { SignUpForm } from "./components/SignUpForm";
import { ISignUpFormData, signUpValidationRules } from "./validation";
import { useFormValidation } from "../../hooks/useFormValidation";

const initialData: ISignUpFormData = {
  firstname: "",
  lastname: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const SignUp = () => {
  const { formData, formErrors, handleChange, handleBlur, validateForm } =
    useFormValidation<ISignUpFormData>(initialData, signUpValidationRules);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      // Form handling will be implemented later
      console.log("Form is valid", formData);
    }
  };

  return (
    <SignUpForm
      formData={formData}
      formErrors={formErrors}
      handleChange={handleChange}
      handleBlur={handleBlur}
      handleSubmit={handleSubmit}
    />
  );
};

export default SignUp;
