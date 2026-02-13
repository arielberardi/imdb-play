import { AuthForm } from "@/components/molecules/AuthForm";
import { signUpAction } from "@/features/auth";
import styles from "../AuthPage.module.css";

export default function SignUpPage() {
  return (
    <div className={styles.authPage}>
      <AuthForm mode="sign-up" action={signUpAction} />
    </div>
  );
}
