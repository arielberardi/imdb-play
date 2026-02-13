"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import type { AuthActionResult, SignInInput, SignUpInput } from "@/features/auth";
import { clsx } from "clsx";
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

  function onSubmit(values: AuthInput) {
    setFormError(null);
    setServerFieldErrors({});

    startTransition(async () => {
      const result = await action(values);
      if (!result.success) {
        setFormError(result.message ?? "Something went wrong.");
        setServerFieldErrors(result.fieldErrors ?? {});
      }
    });
  }

  return (
    <section
      className={clsx(styles.authForm, className)}
      aria-label={isSignIn ? "Sign in" : "Sign up"}
    >
      <header className={styles.authForm__header}>
        <h1 className={styles.authForm__title}>{isSignIn ? "Sign in" : "Create account"}</h1>
        <p className={styles.authForm__subtitle}>
          {isSignIn ? "Welcome back to IMDB Play." : "Start building your watchlist."}
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm__body} noValidate>
        <Input
          type="email"
          label="Email"
          autoComplete="email"
          fullWidth
          error={errors.email?.message ?? serverFieldErrors.email}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email",
            },
          })}
        />
        <Input
          type="password"
          label="Password"
          autoComplete={isSignIn ? "current-password" : "new-password"}
          fullWidth
          error={errors.password?.message ?? serverFieldErrors.password}
          {...register("password", {
            required: "Password is required",
            minLength: isSignIn
              ? undefined
              : {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
          })}
        />
        {formError && (
          <p className={styles.authForm__error} role="alert">
            {formError}
          </p>
        )}
        <Button type="submit" fullWidth isLoading={isPending}>
          {isSignIn ? "Sign In" : "Sign Up"}
        </Button>
      </form>

      <footer className={styles.authForm__footer}>
        <span>{isSignIn ? "No account yet?" : "Already have an account?"}</span>
        <Link href={isSignIn ? "/auth/sign-up" : "/auth/sign-in"}>
          {isSignIn ? "Create one" : "Sign in"}
        </Link>
      </footer>
    </section>
  );
}
