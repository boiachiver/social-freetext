"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { signOut } from "@/lib/auth";

import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ForgotPassword from "@/components/auth/ForgotPassword";

type Screen =
  | "login"
  | "signup"
  | "forgot"
  | "home";

export default function HomePage() {
  const [screen, setScreen] =
    useState<Screen>("login");

  const [user, setUser] =
    useState<FirebaseUser | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);

        if (firebaseUser) {
          setScreen("home");
        } else {
          setScreen("login");
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function logout() {
    try {
      await signOut();
      setUser(null);
      setScreen("login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  }

  if (loading) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-logo-area">
            <div className="sf-logo">
              <span>SF</span>
            </div>

            <div className="auth-brand-name">
              <strong>Social freeText</strong>
              <span>
                Connect. Chat. Share.
              </span>
            </div>
          </div>

          <h1>Loading...</h1>

          <p className="auth-subtitle">
            Connecting to Social freeText
          </p>
        </div>
      </main>
    );
  }

  if (screen === "login") {
    return (
      <main className="auth-page">
        <div className="auth-background-glow glow-one" />
        <div className="auth-background-glow glow-two" />

        <LoginForm
          onSignup={() =>
            setScreen("signup")
          }
          onForgotPassword={() =>
            setScreen("forgot")
          }
          onSuccess={(firebaseUser) => {
            setUser(firebaseUser);
            setScreen("home");
          }}
        />
      </main>
    );
  }

  if (screen === "signup") {
    return (
      <main className="auth-page">
        <div className="auth-background-glow glow-one" />
        <div className="auth-background-glow glow-two" />

        <SignupForm
          onLogin={() =>
            setScreen("login")
          }
          onSuccess={(firebaseUser) => {
            setUser(firebaseUser);
            setScreen("home");
          }}
        />
      </main>
    );
  }

  if (screen === "forgot") {
    return (
      <main className="auth-page">
        <div className="auth-background-glow glow-one" />
        <div className="auth-background-glow glow-two" />

        <ForgotPassword
          onBack={() =>
            setScreen("login")
          }
        />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="top-header">
        <div className="brand-mini">
          <div className="brand-mini-logo">
            SF
          </div>

          <div>
            <strong>
              Social freeText
            </strong>

            <span>
              Connect. Chat. Share.
            </span>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="mini-profile"
            title="Profile"
          >
            {user?.displayName
              ?.charAt(0)
              .toUpperCase() ||
              user?.email
                ?.charAt(0)
                .toUpperCase() ||
              "U"}
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="content-container">
          <div className="page-heading">
            <div>
              <h1>
                Welcome to Social freeText
              </h1>

              <p>
                Welcome back{" "}
                {user?.displayName ||
                  user?.email ||
                  "friend"}{" "}
                👋
              </p>
            </div>
          </div>

          <div className="composer-card">
            <div className="composer-main">
              <h2>
                You're successfully
                signed in 🎉
              </h2>

              <p>
                Your Firebase authentication
                is now connected to Social
                freeText.
              </p>

              <p>
                Account:{" "}
                <strong>
                  {user?.email}
                </strong>
              </p>

              <button
                className="primary-button"
                onClick={logout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </main>
    </main>
  );
}
