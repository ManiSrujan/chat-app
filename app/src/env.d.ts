/// <reference types="@rsbuild/core/types" />

export {}; // Ensure this file is treated as a module

declare global {
  interface Window {
    ENV_CONFIG: { [key: string]: string };
  }
}
