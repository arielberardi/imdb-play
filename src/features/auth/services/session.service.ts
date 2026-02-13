import {
  AUTH_COOKIE_NAME,
  SESSION_TOKEN_BYTES,
  SESSION_TTL_SECONDS,
} from "@/features/auth/constants";
import { AuthRequiredError } from "@/features/auth/errors";
import type { AuthUser } from "@/features/auth/types";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";

function buildSessionExpiryDate(): Date {
  return new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
}

function generateSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTES).toString("hex");
}

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

async function getSessionTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return token ?? null;
}

export async function createSession(userId: string): Promise<void> {
  const token = generateSessionToken();
  const expiresAt = buildSessionExpiryDate();

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, getCookieOptions());
}

export async function getOptionalUser(): Promise<AuthUser | null> {
  const token = await getSessionTokenFromCookie();
  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  const isRevoked = session.revokedAt !== null;
  const isExpired = session.expiresAt.getTime() <= Date.now();

  if (isRevoked || isExpired) {
    return null;
  }

  return session.user;
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getOptionalUser();
  if (!user) {
    throw new AuthRequiredError();
  }

  return user;
}

export async function destroySession(): Promise<void> {
  const token = await getSessionTokenFromCookie();
  const cookieStore = await cookies();

  if (token) {
    await prisma.session.updateMany({
      where: {
        token,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  cookieStore.delete(AUTH_COOKIE_NAME);
}
