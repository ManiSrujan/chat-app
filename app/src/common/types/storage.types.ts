export interface ILoginConfig {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
}

export enum StorageKeys {
  LOGIN_CONFIG = "LoginConfig",
}
