import type { SignInInput } from "@/features/auth/types";
import prisma from "@/lib/prisma";
import { verifyPassword } from "./password.service";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(input: { email: string; passwordHash: string }) {
  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash: input.passwordHash,
    },
    select: {
      id: true,
      email: true,
    },
  });
}

export async function verifyUserCredentials(input: SignInInput) {
  const user = await findUserByEmail(input.email);
  if (!user) {
    return null;
  }

  const isPasswordValid = await verifyPassword(input.password, user.passwordHash);
  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
  };
}
