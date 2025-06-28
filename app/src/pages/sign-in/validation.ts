import { IFormData, Schema } from "./sign-in.types";

function requiredValidation(value: string): string {
  const isValid = value.trim().length > 1 ? true : false;
  return isValid ? "" : "Required";
}

function validate(schema: Schema, value: string, formData: IFormData): string {
  const validations: Record<
    Schema,
    ((value: string, formData: IFormData) => string)[]
  > = {
    username: [requiredValidation],
    password: [requiredValidation],
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
