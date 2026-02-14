"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import type {
  AuthActionResult,
  AuthFieldErrorKey,
  AuthMessageKey,
  SignInInput,
  SignUpInput,
} from "@/features/auth";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import styles from "./AuthForm.module.css";

type AuthMode = "sign-in" | "sign-up";
type AuthInput = SignInInput | SignUpInput;

interface AuthFormProps {
  mode: AuthMode;
  action: (input: AuthInput) => Promise<AuthActionResult>;
  className?: string;
}

export function AuthForm({ mode, action, className }: AuthFormProps) {
  const tForm = useTranslations("auth.form");
  const tErrors = useTranslations("auth.errors");

  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [serverFieldErrors, setServerFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const isSignIn = mode === "sign-in";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function mapMessageKey(key?: AuthMessageKey): string | null {
    if (!key) {
      return null;
    }

    return tErrors(key);
  }

  function mapFieldKey(key?: AuthFieldErrorKey): string | undefined {
    if (!key) {
      return undefined;
    }

    return tErrors(key);
  }

  function onSubmit(values: AuthInput) {
    setFormError(null);
    setServerFieldErrors({});

    startTransition(async () => {
      const result = await action(values);
      if (!result.success) {
        setFormError(mapMessageKey(result.messageKey) ?? result.message ?? tForm("fallbackError"));
        setServerFieldErrors({
          email: mapFieldKey(result.fieldErrorKeys?.email) ?? result.fieldErrors?.email,
          password: mapFieldKey(result.fieldErrorKeys?.password) ?? result.fieldErrors?.password,
        });
      }
    });
  }

  return (
    <section
      className={clsx(styles.authForm, className)}
      aria-label={isSignIn ? tForm("signInAriaLabel") : tForm("signUpAriaLabel")}
    >
      <header className={styles.authForm__header}>
        <h1 className={styles.authForm__title}>
          {isSignIn ? tForm("signInTitle") : tForm("signUpTitle")}
        </h1>
        <p className={styles.authForm__subtitle}>
          {isSignIn ? tForm("signInSubtitle") : tForm("signUpSubtitle")}
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm__body} noValidate>
        <Input
          type="email"
          label={tForm("emailLabel")}
          autoComplete="email"
          fullWidth
          error={errors.email?.message ?? serverFieldErrors.email}
          {...register("email", {
            required: tErrors("field.email.required"),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: tErrors("field.email.invalid"),
            },
          })}
        />
        <Input
          type="password"
          label={tForm("passwordLabel")}
          autoComplete={isSignIn ? "current-password" : "new-password"}
          fullWidth
          error={errors.password?.message ?? serverFieldErrors.password}
          {...register("password", {
            required: tErrors("field.password.required"),
            minLength: isSignIn
              ? undefined
              : {
                  value: 8,
                  message: tErrors("field.password.minLength"),
                },
          })}
        />
        {formError && (
          <p className={styles.authForm__error} role="alert">
            {formError}
          </p>
        )}
        <Button type="submit" fullWidth isLoading={isPending}>
          {isSignIn ? tForm("signInButton") : tForm("signUpButton")}
        </Button>
      </form>

      <footer className={styles.authForm__footer}>
        <span>{isSignIn ? tForm("noAccount") : tForm("hasAccount")}</span>
        <Link href={isSignIn ? "/auth/sign-up" : "/auth/sign-in"}>
          {isSignIn ? tForm("createOne") : tForm("goToSignIn")}
        </Link>
      </footer>
    </section>
  );
}
