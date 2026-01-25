"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import styles from "./SignInPage.module.css";

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginErrorResponse = {
  error?: string;
};

export default function SignInPage() {
  const router = useRouter();
  const setLoadingStore = useAuthStore((state) => state.setLoading);

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const mutation = useMutation({
    mutationFn: login,
    onMutate: () => setLoadingStore(true),
    onSuccess: () => router.push("/main-transactions"),
    onError: (err: AxiosError<LoginErrorResponse>) => {
      alert(err.response?.data?.error ?? "Login failed");
    },
    onSettled: () => setLoadingStore(false),
  });

  const handleSubmit = (formData: FormData) => {
    setErrors({});

    const body: LoginCredentials = {
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    };

    const newErrors: typeof errors = {};
    if (!body.email) newErrors.email = "Email is required";
    if (!body.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    mutation.mutate(body);
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
          <div className={styles.passwordWrapper}>
            <input
              className={styles.input}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />

            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword((p) => !p)}
            >
              <img src="/eye-off.svg" alt="Toggle password visibility" />
            </button>
          </div>

          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </div>

        <div className={styles.thirdblock}>
          <button
            className={styles.button}
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Loading..." : "Sign in"}
          </button>
        </div>
      </form>

      <p className={styles.linkText}>
        Don’t have an account? <a href="/sign-up">Sign up</a>
      </p>
    </section>
  );
}
