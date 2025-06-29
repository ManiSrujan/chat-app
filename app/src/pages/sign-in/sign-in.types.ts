export type Schema = "username" | "password";

export type IFormData = Record<Schema, { value: string; error: string }>;

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
}
