"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/redux/api/authApi"; // Redux API layer
import { setUser } from "@/redux/slices/authSlice"; // Redux slice

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await authApi.login({
        username: username,
        password: password,
      });

      if (response?.success) {
        dispatch(setUser(response.data));
        router.replace("/dashboard");
      } else {
        setError(response?.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err?.message || "Failed to sign in. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-intro" aria-label="SpotOptics account">
        <Link className="account-brand" href="/" aria-label="SpotOptics home">
          <span className="account-brand-mark">S</span>
          <span>SpotOptics</span>
        </Link>
        <div className="login-intro-copy">
          <span className="account-eyebrow">YOUR WORKSPACE</span>
          <h1>Precision starts with a clear view.</h1>
          <p>
            Sign in to your workspace and keep your team, projects, and insights
            in one place.
          </p>
        </div>
        <div className="login-decoration" aria-hidden="true">
          <div className="login-orbit login-orbit-one" />
          <div className="login-orbit login-orbit-two" />
          <div className="login-orbit login-orbit-three" />
          <span className="login-orbit-core" />
        </div>
        <p className="login-intro-footer">A sharper way to work.</p>
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrap">
          <div className="login-mobile-brand">
            <span className="account-brand-mark">S</span>
            <span>SpotOptics</span>
          </div>
          <span className="account-eyebrow">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="login-subtitle">Enter your details to access the dashboard.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="Username">Username</label>
            <input
              autoComplete="username"
              id="Username"
              name="username"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              required
              type="text"
              value={username}
            />

            <div className="login-password-label">
              <label htmlFor="login-password">Password</label>
            </div>
            <input
              autoComplete="current-password"
              id="login-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              type="password"
              value={password}
            />

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button className="login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : <>Sign in <span aria-hidden="true">→</span></>}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
