import { useRef, useState } from "react";
import { IFormData, Schema } from "./sign-up.types";
import { validate } from "./validation";
import { RootProps } from "@radix-ui/themes/components/text-field";
import restClient from "src/common/rest-client/restClient";
import { getEnvConfig } from "src/common/env-config/envConfig";
import { ENV_CONFIG_KEY } from "src/common/env-config/constants";
import { useLocation } from "wouter";
import { Routes } from "src/common/constants";
import { AxiosError } from "axios";

const useSignUp = () => {
  const refs = useRef<Record<Schema, HTMLInputElement | null>>({
    firstName: null,
    lastName: null,
    username: null,
    password: null,
    confirmPassword: null,
  });
  const [formData, setFormData] = useState<IFormData>({
    firstName: { value: "", error: "" },
    lastName: { value: "", error: "" },
    username: { value: "", error: "" },
    password: { value: "", error: "" },
    confirmPassword: { value: "", error: "" },
  });
  const [passwordType, setPasswordType] =
    useState<RootProps["type"]>("password");
  const [confirmPasswordType, setConfirmPasswordType] =
    useState<RootProps["type"]>("password");
  const [, setLocation] = useLocation();

  async function createUser() {
    try {
      await restClient.post<void>(
        `${getEnvConfig(ENV_CONFIG_KEY.API)}/auth/signup`,
        {
          firstname: formData.firstName.value,
          lastname: formData.lastName.value,
          username: formData.username.value,
          password: formData.password.value,
        },
      );
      setLocation(Routes.SignIn); // Redirect to login page after successful sign-up
    } catch (error) {
      if (error instanceof AxiosError && error.status === 409) {
        setFormData((state) => {
          return {
            ...state,
            ["username"]: {
              ...state["username"],
              error: "Username already exists",
            },
          };
        });
        refs.current.username?.focus();
      }
      // TODO: Add a notification component that displays error later
      console.error("Signup Failed:", error);
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
      createUser();
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

  function handleKeyPress(
    event: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>,
  ): void {
    if (event.key === "Enter") {
      onSubmit();
    }
  }

  return {
    formData,
    onChange,
    onSubmit,
    refs,
    passwordType,
    setPasswordType,
    confirmPasswordType,
    setConfirmPasswordType,
    handleKeyPress,
  };
};

export default useSignUp;
