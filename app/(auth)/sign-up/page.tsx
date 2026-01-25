"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import styles from "./SignUpPage.module.css";

type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
};

type RegisterErrorResponse = {
  error?: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const setLoadingStore = useAuthStore((state) => state.setLoading);

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const mutation = useMutation({
    mutationFn: register,
    onMutate: () => setLoadingStore(true),
    onSuccess: () => router.push("/main-transactions"),
    onError: (err: AxiosError<RegisterErrorResponse>) => {
      alert(err.response?.data?.error ?? "Registration failed");
    },
    onSettled: () => setLoadingStore(false),
  });

  const handleSubmit = (formData: FormData) => {
    setErrors({});

    const body: RegisterCredentials = {
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    };

    const newErrors: typeof errors = {};
    if (!body.name) newErrors.name = "Name is required";
    if (!body.email) newErrors.email = "Email is required";
    if (!body.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    mutation.mutate(body);
  };

  return (
    <div className={styles.page}>
      <section className={styles.container}>
        <div className={styles.firstblock}>
          <h1 className={styles.title}>Sign up</h1>
          <p className={styles.description}>
            Step into a world of hassle-free expense management! Your journey
            towards financial mastery begins here.
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
            <input className={styles.inputs} name="name" placeholder="Name" />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <input
              className={styles.inputs}
              name="email"
              type="email"
              placeholder="Email"
            />
            {errors.email && (
              <span className={styles.error}>{errors.email}</span>
            )}
          </div>

          <div className={styles.field}>
            <div className={styles.passwordWrapper}>
              <input
                className={styles.inputs}
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
              {mutation.isPending ? "Loading..." : "Sign up"}
            </button>
          </div>
        </form>

        <p className={styles.linkText}>
          Already have an account? <a href="/sign-in">Sign in</a>
        </p>
      </section>
    </div>
  );
}
