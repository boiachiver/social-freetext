"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Send,
} from "lucide-react";

import { resetPassword } from "@/lib/auth";

type ForgotPasswordProps = {
  onBack: () => void;
};

export default function ForgotPassword({
  onBack,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const submitReset = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(cleanEmail);

      setSuccess(
        "Password reset email sent. Please check your inbox."
      );

      setEmail("");
    } catch (error: unknown) {
      const firebaseError = error as {
        code?: string;
        message?: string;
      };

      switch (firebaseError.code) {
        case "auth/invalid-email":
          setError(
            "Please enter a valid email address."
          );
          break;

        case "auth/user-not-found":
          setError(
            "No account was found with this email."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Too many requests. Please try again later."
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
              "Unable to send the reset email. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      {/* LOGO */}

      <div className="auth-logo-area">
        <div className="sf-logo">
          <div className="sf-ring" />
          <div className="sf-ring-two" />
          <div className="sf-shine" />

          <span>SF</span>
        </div>

        <div className="auth-brand-name">
          <strong>Social freeText</strong>

          <span>
            Connect. Chat. Share.
          </span>
        </div>
      </div>

      {/* TITLE */}

      <h1>Reset password</h1>

      <p className="auth-subtitle">
        Enter your email and we'll send you a
        password reset link.
      </p>

      {/* FORM */}

      <form onSubmit={submitReset}>
        <div className="form-group">
          <label htmlFor="reset-email">
            Email address
          </label>

          <div className="input-wrapper">
            <Mail size={19} />

            <input
              id="reset-email"
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

        {/* ERROR */}

        {error && (
          <div
            className="auth-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div
            className="auth-success"
            role="status"
          >
            {success}
          </div>
        )}

        {/* SEND BUTTON */}

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : "Send Reset Link"}

          {!loading && (
            <Send size={19} />
          )}
        </button>
      </form>

      {/* BACK */}

      <button
        type="button"
        className="secondary-button"
        onClick={onBack}
        disabled={loading}
      >
        <ArrowLeft size={19} />
        Back to Sign In
      </button>

      {/* FOOTER */}

      <div className="auth-footer">
        Powered by{" "}
        <strong>Boi AchiverAI</strong>
      </div>
    </div>
  );
}
