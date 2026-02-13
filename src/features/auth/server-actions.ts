"use server";

import type { AuthActionResult, SignInInput, SignUpInput } from "@/features/auth/types";
import { signInSchema, signUpSchema } from "@/features/auth/validators";
import { redirect } from "next/navigation";
import { createUser, findUserByEmail, verifyUserCredentials } from "./services/auth.service";
import { hashPassword } from "./services/password.service";
import { createSession, destroySession } from "./services/session.service";

function mapValidationError(fieldErrors: {
  email?: string[];
  password?: string[];
}): AuthActionResult {
  return {
    success: false,
    message: "Please fix the highlighted fields.",
    fieldErrors: {
      email: fieldErrors.email?.[0],
      password: fieldErrors.password?.[0],
    },
  };
}

export async function signUpAction(input: SignUpInput): Promise<AuthActionResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return mapValidationError(parsed.error.flatten().fieldErrors);
  }

  try {
    const payload = parsed.data;
    const existingUser = await findUserByEmail(payload.email);

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists.",
        fieldErrors: {
          email: "Email is already in use.",
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
      message: "Unable to create your account right now.",
    };
  }

  redirect("/");
}

export async function signInAction(input: SignInInput): Promise<AuthActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return mapValidationError(parsed.error.flatten().fieldErrors);
  }

  try {
    const payload = parsed.data;
    const user = await verifyUserCredentials(payload);

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    await createSession(user.id);
  } catch {
    return {
      success: false,
      message: "Unable to sign you in right now.",
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
      message: "Unable to sign out right now.",
    };
  }

  redirect("/");
}
