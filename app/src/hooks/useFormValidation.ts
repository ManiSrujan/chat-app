import { useState } from "react";

export type ValidationRule<T> = (value: string, formData: T) => string;

export interface IFieldValidation<T> {
  [key: string]: ValidationRule<T>[];
}

export interface IFormErrors {
  [key: string]: string;
}

export function useFormValidation<T extends Record<string, string>>(
  initialData: T,
  validationRules: IFieldValidation<T>,
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [formErrors, setFormErrors] = useState<IFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string => {
    if (!validationRules[name]) return "";

    for (const rule of validationRules[name]) {
      const error = rule(value, formData);
      if (error) return error;
    }
    return "";
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }

    // Validate dependent fields if needed (like confirm password)
    Object.keys(validationRules).forEach((fieldName) => {
      if (fieldName !== name && touched[fieldName]) {
        setFormErrors((prev) => ({
          ...prev,
          [fieldName]: validateField(fieldName, formData[fieldName as keyof T]),
        }));
      }
    });
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateForm = (): boolean => {
    const errors: IFormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });

    setFormErrors(errors);
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
    );
    return isValid;
  };

  const resetForm = () => {
    setFormData(initialData);
    setFormErrors({});
    setTouched({});
  };

  return {
    formData,
    formErrors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFormData,
  };
}
