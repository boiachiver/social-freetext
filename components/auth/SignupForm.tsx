"use client";

import { FormEvent, useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";

import { auth } from "@/lib/firebase";

type SignupFormProps = {
  onSuccess: () => void;
  onLogin: () => void;
};

export default function SignupForm({
  onSuccess,
  onLogin,
}: SignupFormProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitSignup = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (
      !cleanName ||
      !cleanUsername ||
      !cleanEmail ||
      !password ||
      !confirmPassword
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (cleanUsername.length < 3) {
      setError("Username must contain at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      await updateProfile(userCredential.user, {
        displayName: cleanName,
      });

      onSuccess();
    } catch (error: unknown) {
      const firebaseError = error as {
        code?: string;
        message?: string;
      };

      switch (firebaseError.code) {
        case "auth/email-already-in-use":
          setError(
            "An account with this email already exists."
          );
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/weak-password":
          setError(
            "Your password is too weak. Please choose a stronger password."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        case "auth/operation-not-allowed":
          setError(
            "Email/password authentication is not enabled in Firebase."
          );
          break;

        default:
          setError(
            firebaseError.message ||
              "Unable to create your account. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card signup-card">
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

      <h1>Create account</h1>

      <p className="auth-subtitle">
        Join Social freeText and connect with everyone
      </p>

      <form onSubmit={submitSignup}>
        <div className="form-group">
          <label htmlFor="signup-name">Full name</label>

          <div className="input-wrapper">
            <User size={19} />

            <input
              id="signup-name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              autoComplete="name"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="signup-username">
            Username
          </label>

          <div className="input-wrapper">
            <span className="username-symbol">@</span>

            <input
              id="signup-username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9_]/g, "")
                )
              }
              autoComplete="username"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="signup-email">
            Email address
          </label>

          <div className="input-wrapper">
            <Mail size={19} />

            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
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
          <label htmlFor="signup-password">
            Password
          </label>

          <div className="input-wrapper">
            <Lock size={19} />

            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="new-password"
              disabled={loading}
            />

            <button
              type="button"
              className="input-icon-button"
              onClick={() =>
                setShowPassword((current) => !current)
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

        <div className="form-group">
          <label htmlFor="signup-confirm-password">
            Confirm password
          </label>

          <div className="input-wrapper">
            <Lock size={19} />

            <input
              id="signup-confirm-password"
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
              disabled={loading}
            />

            <button
              type="button"
              className="input-icon-button"
              onClick={() =>
                setShowConfirmPassword(
                  (current) => !current
                )
              }
              disabled={loading}
            >
              {showConfirmPassword ? (
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
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}

          {!loading && <ArrowRight size={19} />}
        </button>
      </form>

      <p className="terms-text">
        By creating an account, you agree to our Terms
        and Privacy Policy.
      </p>

      <button
        type="button"
        className="secondary-button"
        onClick={onLogin}
        disabled={loading}
      >
        Already have an account? Sign In
      </button>

      <div className="auth-footer">
        Powered by <strong>Boi AchiverAI</strong>
      </div>
    </div>
  );
}
