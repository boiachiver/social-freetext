"use client";

import { useState } from "react";
import { ArrowLeft, Mail, Send } from "lucide-react";

import { handlePasswordReset } from "@/lib/auth";

type ForgotPasswordProps = {
  onBack: () => void;
};

export default function ForgotPassword({
  onBack,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function resetPassword() {
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await handlePasswordReset(email.trim());

      setMessage(
        "Password reset email sent. Check your inbox."
      );
    } catch (error: any) {
      console.error(error);

      if (error?.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(
          error?.message ||
            "Unable to send the reset email."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <button
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft size={20} />
        Back to login
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

      <h1>Reset password</h1>

      <p className="auth-subtitle">
        Enter your email and we'll send you a password
        reset link.
      </p>

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      {message && (
        <div className="auth-success">
          {message}
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

      <button
        className="primary-button"
        onClick={resetPassword}
        disabled={loading}
      >
        {loading
          ? "Sending..."
          : "Send Reset Link"}

        {!loading && <Send size={19} />}
      </button>

      <div className="auth-footer">
        Powered by <strong>Boi AchiverAI</strong>
      </div>
    </div>
  );
}