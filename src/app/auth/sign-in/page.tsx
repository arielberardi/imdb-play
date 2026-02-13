import { AuthForm } from "@/components/molecules/AuthForm";
import { signInAction } from "@/features/auth";
import styles from "../AuthPage.module.css";

export default function SignInPage() {
  return (
    <div className={styles.authPage}>
      <AuthForm mode="sign-in" action={signInAction} />
    </div>
  );
}
