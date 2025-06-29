import { getItem } from "../local-storage/localStorage";
import { ILoginConfig, StorageKeys } from "../types/storage.types";

export function getLoggedUserId(): string | null {
  const loginConfig = getItem<ILoginConfig>(StorageKeys.LOGIN_CONFIG);

  if (loginConfig) {
    return loginConfig.userId;
  }

  return null;
}

export function getLoggedUserName(): string | null {
  const loginConfig = getItem<ILoginConfig>(StorageKeys.LOGIN_CONFIG);
  if (loginConfig) {
    return loginConfig.userName;
  }
  return null;
}

export function getAccessToken(): string | null {
  const loginConfig = getItem<ILoginConfig>(StorageKeys.LOGIN_CONFIG);
  if (loginConfig) {
    return loginConfig.accessToken;
  }
  return null;
}

export function getFirstName(): string | null {
  const loginConfig = getItem<ILoginConfig>(StorageKeys.LOGIN_CONFIG);
  if (loginConfig) {
    return loginConfig.firstName;
  }
  return null;
}

export function getLastName(): string | null {
  const loginConfig = getItem<ILoginConfig>(StorageKeys.LOGIN_CONFIG);
  if (loginConfig) {
    return loginConfig.lastName;
  }
  return null;
}

export function getFullName(firstName: string, lastName: string) {
  return `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`;
}

export function getAvatarName(firstName: string, lastName: string) {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
}
