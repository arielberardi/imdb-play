"use server";

import type { AuthActionResult, SignInInput, SignUpInput } from "@/features/auth/types";
import { signInSchema, signUpSchema } from "@/features/auth/validators";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createUser, findUserByEmail, verifyUserCredentials } from "./services/auth.service";
import { hashPassword } from "./services/password.service";
import { createSession, destroySession } from "./services/session.service";

function mapValidationError(error: z.ZodError<SignInInput | SignUpInput>): AuthActionResult {
  const fieldErrorKeys: NonNullable<AuthActionResult["fieldErrorKeys"]> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (field === "email" && !fieldErrorKeys.email) {
      fieldErrorKeys.email = "field.email.invalid";
    }

    if (field === "password" && !fieldErrorKeys.password) {
      if (issue.code === "too_small" && issue.minimum === 1) {
        fieldErrorKeys.password = "field.password.required";
      } else if (issue.code === "too_small") {
        fieldErrorKeys.password = "field.password.minLength";
      }
    }
  }

  return {
    success: false,
    messageKey: "validation.fixFields",
    fieldErrorKeys,
  };
}

export async function signUpAction(input: SignUpInput): Promise<AuthActionResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return mapValidationError(parsed.error);
  }

  try {
    const payload = parsed.data;
    const existingUser = await findUserByEmail(payload.email);

    if (existingUser) {
      return {
        success: false,
        messageKey: "signUp.duplicateEmail",
        fieldErrorKeys: {
          email: "field.email.alreadyInUse",
        },
      };
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await createUser({
      email: payload.email,
      passwordHash,
    });

    await createSession(user.id);
  } catch {
    return {
      success: false,
      messageKey: "signUp.createFailed",
    };
  }

  redirect("/");
}

export async function signInAction(input: SignInInput): Promise<AuthActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return mapValidationError(parsed.error);
  }

  try {
    const payload = parsed.data;
    const user = await verifyUserCredentials(payload);

    if (!user) {
      return {
        success: false,
        messageKey: "signIn.invalidCredentials",
      };
    }

    await createSession(user.id);
  } catch {
    return {
      success: false,
      messageKey: "signIn.failed",
    };
  }

  redirect("/");
}

export async function signOutAction(): Promise<AuthActionResult> {
  try {
    await destroySession();
  } catch {
    return {
      success: false,
      messageKey: "signOut.failed",
    };
  }

  redirect("/");
}
