import React from "react";
import styles from "./FormField.module.css";

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  description,
  required = false,
  children,
}: FormFieldProps) {
  const effectiveHint = hint || description;

  return (
    <div className={styles.formField}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {children}
      {effectiveHint && !error && <span className={styles.hint}>{effectiveHint}</span>}
      {error && (
        <span id={htmlFor ? `${htmlFor}-error` : undefined} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
