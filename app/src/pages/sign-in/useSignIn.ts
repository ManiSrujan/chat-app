import { useMemo, useRef, useState } from "react";
import { IFormData, ILoginResponse, Schema } from "./sign-in.types";
import { validate } from "./validation";
import { RootProps } from "@radix-ui/themes/components/text-field";
import restClient from "src/common/rest-client/restClient";
import { useLocation } from "wouter";
import { getEnvConfig } from "src/common/env-config/envConfig";
import { ENV_CONFIG_KEY } from "src/common/env-config/constants";
import { setItem } from "src/common/local-storage/localStorage";
import { StorageKeys } from "src/common/types/storage.types";
import { getAccessToken } from "src/common/user/user";
import { Routes } from "src/common/constants";

const useSignIn = () => {
  const refs = useRef<Record<Schema, HTMLInputElement | null>>({
    username: null,
    password: null,
  });
  const [formData, setFormData] = useState<IFormData>({
    username: { value: "", error: "" },
    password: { value: "", error: "" },
  });
  const [passwordType, setPasswordType] =
    useState<RootProps["type"]>("password");
  const [, setLocation] = useLocation();

  useMemo(() => {
    if (getAccessToken()) {
      setLocation(Routes.Chat);
    }
  }, []);

  async function login() {
    try {
      const response = await restClient.post<ILoginResponse>(
        `${getEnvConfig(ENV_CONFIG_KEY.API)}/auth/login`,
        {
          username: formData.username.value,
          password: formData.password.value,
        },
      );
      const {
        accessToken,
        refreshToken,
        userId,
        userName,
        firstName,
        lastName,
      } = response.data;

      // Store tokens and user info
      setItem(StorageKeys.LOGIN_CONFIG, {
        accessToken,
        refreshToken,
        userId,
        userName,
        firstName,
        lastName,
      });

      // Redirect to chat
      setLocation(Routes.Chat);
    } catch (error) {
      // TODO: Add a notification component that displays error later
      console.error("Login failed:", error);
    }
  }

  function onSubmit() {
    let isValid = true;
    let focusElement: HTMLInputElement | undefined;
    for (const value of Object.keys(formData)) {
      const schema = value as Schema;
      const error = validate(schema, formData[schema].value, formData);
      if (!focusElement && error) {
        setFormData((state) => {
          return { ...state, [schema]: { ...state[schema], error } };
        });
        isValid = false;
        focusElement = refs.current[schema] ?? undefined;
      } else {
        setFormData((state) => {
          return { ...state, [schema]: { ...state[schema], error: "" } };
        });
      }
    }

    if (isValid) {
      login();
    } else {
      focusElement?.focus();
    }
  }

  function onChange(
    schema: Schema,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    const value = event.target.value;
    setFormData({
      ...formData,
      [schema]: { ...formData[schema], value },
    });
  }

  return {
    formData,
    onChange,
    onSubmit,
    refs,
    passwordType,
    setPasswordType,
  };
};

export default useSignIn;
