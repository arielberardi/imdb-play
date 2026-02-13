import { getOptionalUser, signOutAction } from "@/features/auth";
import { NavbarView } from "./NavbarView";

export async function Navbar() {
  const user = await getOptionalUser();

  async function handleSignOut(): Promise<void> {
    "use server";
    await signOutAction();
  }

  return <NavbarView user={user} onSignOut={handleSignOut} />;
}
