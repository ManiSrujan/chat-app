import { IFormData, Schema } from "./sign-up.types";

function requiredValidation(value: string): string {
  const isValid = value.trim().length > 1 ? true : false;
  return isValid ? "" : "Required";
}

function validate(schema: Schema, value: string, formData: IFormData): string {
  const validations: Record<
    Schema,
    ((value: string, formData: IFormData) => string)[]
  > = {
    firstName: [requiredValidation],
    lastName: [requiredValidation],
    username: [requiredValidation],
    password: [
      requiredValidation,
      (value: string): string => {
        return value.trim().length < 6
          ? "Password must be atleast of length 6"
          : "";
      },
    ],
    confirmPassword: [
      requiredValidation,
      (value: string, formData: IFormData) => {
        const password = formData.password.value;
        return password !== value ? "Doesnt match with password" : "";
      },
    ],
  };

  for (const func of validations[schema]) {
    const message = func(value, formData);
    if (message) {
      return message;
    }
  }
  return "";
}

export { validate };
