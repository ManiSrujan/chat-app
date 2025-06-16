import { getItem } from "../local-storage/localStorage";
import { ILoginConfig, StorageKeys } from "../types/storage.types";

export function getLoggedUserId(): string | null {
  const loginConfig = getItem<ILoginConfig>(StorageKeys.LOGIN_CONFIG);

  if (loginConfig) {
    return loginConfig.userId;
  }

  return null;
}

export function getFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`;
}
