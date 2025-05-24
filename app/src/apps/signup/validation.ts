import { IFieldValidation } from "../../hooks/useFormValidation";

export interface ISignUpFormData extends Record<string, string> {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export const signUpValidationRules: IFieldValidation<ISignUpFormData> = {
  firstname: [(value) => (value.trim() === "" ? "First name is required" : "")],
  lastname: [(value) => (value.trim() === "" ? "Last name is required" : "")],
  username: [(value) => (value.trim() === "" ? "Username is required" : "")],
  password: [
    (value) => (value === "" ? "Password is required" : ""),
    (value) =>
      value.length < 6 ? "Password must be at least 6 characters" : "",
  ],
  confirmPassword: [
    (value) => (value === "" ? "Please confirm your password" : ""),
    (value, formData) =>
      value !== formData.password ? "Passwords do not match" : "",
  ],
};
