"use client";

import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

import { handleLogin } from "@/lib/auth";

type LoginFormProps = {
  onSignup: () => void;
  onForgotPassword: () => void;
  onSuccess: (user: any) => void;
};

export default function LoginForm({
  onSignup,
  onForgotPassword,
  onSuccess,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitLogin() {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const user = await handleLogin(
        email.trim(),
        password
      );

      onSuccess(user);
    } catch (error: any) {
      console.error(error);

      switch (error?.code) {
        case "auth/invalid-credential":
          setError("Incorrect email or password.");
          break;

        case "auth/user-not-found":
          setError("No account was found with this email.");
          break;

        case "auth/wrong-password":
          setError("Incorrect password.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/too-many-requests":
          setError(
            "Too many attempts. Please try again later."
          );
          break;

        default:
          setError(
            error?.message ||
              "Unable to sign in. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-logo-area">
        <div className="sf-logo">
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

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <div className="form-group">
        <label>Email address</label>

        <div className="input-wrapper">
          <Mail size={19} />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            autoComplete="email"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Password</label>

        <div className="input-wrapper">
          <Lock size={19} />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="current-password"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submitLogin();
              }
            }}
          />

          <button
            type="button"
            className="input-icon-button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        </div>
      </div>

      <button
        className="forgot-button"
        onClick={onForgotPassword}
      >
        Forgot password?
      </button>

      <button
        className="primary-button"
        onClick={submitLogin}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}

        {!loading && <ArrowRight size={19} />}
      </button>

      <div className="divider">
        <span>OR</span>
      </div>

      <button
        className="secondary-button"
        onClick={onSignup}
      >
        Create New Account
      </button>

      <div className="auth-footer">
        Powered by <strong>Boi AchiverAI</strong>
      </div>
    </div>
  );
}