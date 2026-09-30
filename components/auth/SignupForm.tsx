"use client";

import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";

import { handleSignup } from "@/lib/auth";

type SignupFormProps = {
  onLogin: () => void;
  onSuccess: (user: any, name: string, username: string) => void;
};

export default function SignupForm({
  onLogin,
  onSuccess,
}: SignupFormProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitSignup() {
    setError("");

    if (
      !name.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const user = await handleSignup(
        email.trim(),
        password,
        name.trim()
      );

      onSuccess(
        user,
        name.trim(),
        username.trim().toLowerCase()
      );
    } catch (error: any) {
      console.error(error);

      switch (error?.code) {
        case "auth/email-already-in-use":
          setError(
            "An account already exists with this email."
          );
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/weak-password":
          setError("Your password is too weak.");
          break;

        default:
          setError(
            error?.message ||
              "Unable to create your account."
          );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card signup-card">
      <button
        className="back-button"
        onClick={onLogin}
      >
        ← Back to login
      </button>

      <div className="auth-logo-area">
        <div className="sf-logo">
          <span>SF</span>
        </div>

        <div className="auth-brand-name">
          <strong>Social freeText</strong>
          <span>Connect. Chat. Share.</span>
        </div>
      </div>

      <h1>Create account</h1>

      <p className="auth-subtitle">
        Join Social freeText and connect with everyone
      </p>

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <div className="form-group">
        <label>Full name</label>

        <div className="input-wrapper">
          <User size={19} />

          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </div>
      </div>

      <div className="form-group">
        <label>Username</label>

        <div className="input-wrapper">
          <span className="username-symbol">
            @
          </span>

          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(event) =>
              setUsername(
                event.target.value
                  .toLowerCase()
                  .replace(/\s/g, "")
              )
            }
          />
        </div>
      </div>

      <div className="form-group">
        <label>Email address</label>

        <div className="input-wrapper">
          <Mail size={19} />

          <input
            type="email"
            placeholder="you@example.com"
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
            placeholder="At least 6 characters"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="new-password"
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

      <div className="form-group">
        <label>Confirm password</label>

        <div className="input-wrapper">
          <Lock size={19} />

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            autoComplete="new-password"
          />

          <button
            type="button"
            className="input-icon-button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
          >
            {showConfirmPassword ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        </div>
      </div>

      <button
        className="primary-button"
        onClick={submitSignup}
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create Account"}

        {!loading && <ArrowRight size={19} />}
      </button>

      <p className="terms-text">
        By creating an account, you agree to our
        Terms and Privacy Policy.
      </p>

      <div className="auth-footer">
        Powered by <strong>Boi AchiverAI</strong>
      </div>
    </div>
  );
}