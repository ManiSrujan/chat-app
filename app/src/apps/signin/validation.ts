import { IFieldValidation } from "../../hooks/useFormValidation";

export interface ISignInFormData extends Record<string, string> {
  username: string;
  password: string;
}

export const signInValidationRules: IFieldValidation<ISignInFormData> = {
  username: [(value) => (value.trim() === "" ? "Username is required" : "")],
  password: [
    (value) => (value === "" ? "Password is required" : ""),
    (value) =>
      value.length < 6 ? "Password must be at least 6 characters" : "",
  ],
};
