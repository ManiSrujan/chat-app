export type Schema =
  | "firstName"
  | "lastName"
  | "username"
  | "password"
  | "confirmPassword";

export type IFormData = Record<Schema, { value: string; error: string }>;
