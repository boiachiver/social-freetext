"use client";

import { FormEvent, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

import { auth } from "@/lib/firebase";

type LoginFormProps = {
  onSuccess: () => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
};

export default function LoginForm({
  onSuccess,
  onForgotPassword,
  onCreateAccount,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      onSuccess();
    } catch (error: unknown) {
      const firebaseError = error as {
        code?: string;
        message?: string;
      };

      switch (firebaseError.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/user-not-found":
          setError("No account was found with this email.");
          break;

        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;

        case "auth/invalid-credential":
          setError("Incorrect email or password.");
          break;

        case "auth/too-many-requests":
          setError(
            "Too many unsuccessful attempts. Please try again later."
          );
          break;

        case "auth/user-disabled":
          setError(
            "This account has been disabled. Please contact support."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        default:
          setError(
            firebaseError.message ||
              "Unable to sign in. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore logout errors here.
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-logo-area">
        <div className="sf-logo">
          <div className="sf-ring" />
          <div className="sf-ring-two" />
          <div className="sf-shine" />
          <span>SF</span>
        </div>

        <div className="auth-brand-name">
          <strong>Social freeText</strong>
          <span>Connect. Chat. Share.</span>
        </div>
      </div>

      <h1>Welcome back</h1>

      <p className="auth-subtitle">
        Sign in to continue to Social freeText
      </p>

      <form onSubmit={submitLogin}>
        <div className="form-group">
          <label htmlFor="login-email">
            Email address
          </label>

          <div className="input-wrapper">
            <Mail size={19} />

            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="login-password">
            Password
          </label>

          <div className="input-wrapper">
            <Lock size={19} />

            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              disabled={loading}
            />

            <button
              type="button"
              className="input-icon-button"
              onClick={() =>
                setShowPassword((current) => !current)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <button
          type="button"
          className="forgot-button"
          onClick={onForgotPassword}
          disabled={loading}
        >
          Forgot password?
        </button>

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}

          {!loading && <ArrowRight size={19} />}
        </button>
      </form>

      <div className="divider">
        <span>OR</span>
      </div>

      <button
        type="button"
        className="secondary-button"
        onClick={onCreateAccount}
        disabled={loading}
      >
        Create New Account
      </button>

      <div className="auth-footer">
        Powered by <strong>Boi AchiverAI</strong>
      </div>
    </div>
  );
}
