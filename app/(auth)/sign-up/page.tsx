"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (formData: FormData) => {
    setErrors({});
    setLoading(true);

    const body = {
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    };

    const newErrors: typeof errors = {};
    if (!body.name) newErrors.name = "Name is required";
    if (!body.email) newErrors.email = "Email is required";
    if (!body.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data: { error?: string } = await res.json();
        alert(data.error || "Registration failed");
        return;
      }

      router.push("/dashboard");
    } catch {
      alert("Unexpected error");
    } finally {
      setLoading(false);
    }
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
            <input
              className={styles.inputs}
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
              {loading ? "Loading..." : "Sign up"}
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
