"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./SignInPage.module.css";
import { login } from "@/lib/api/clientApi";
import { LoginCredentials } from "@/types/auth";

export default function SignInPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (formData: FormData) => {
    setErrors({});
    setLoading(true);

    const values: LoginCredentials = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const newErrors: { email?: string; password?: string } = {};
    if (!values.email) newErrors.email = "Email is required";
    if (!values.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await login(values);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className={styles.container}>
      <div className={styles.firstblock}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.description}>
          Welcome back to effortless expense tracking! Your financial dashboard
          awaits.
        </p>
      </div>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(new FormData(e.currentTarget));
        }}
      >
        <div className={styles.field}>
          <input
            className={styles.input}
            name="email"
            type="email"
            placeholder="Email"
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.field}>
          <input
            className={styles.input}
            name="password"
            type="password"
            placeholder="Password"
          />
          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </div>
        <div className={styles.thirdblock}>
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Loading..." : "Sign in"}
          </button>
        </div>
      </form>
      <p className={styles.linkText}>
        Don’t have an account? <a href="/sign-up">Sign up</a>
      </p>
    </section>
  );
}
