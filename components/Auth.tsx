"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "@/lib/firebase";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ForgotPassword from "@/components/auth/ForgotPassword";

type AuthScreen = "login" | "signup" | "forgot";

type AuthProps = {
  children: React.ReactNode;
};

export default function Auth({ children }: AuthProps) {
  const [screen, setScreen] = useState<AuthScreen>("login");
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setCheckingAuth(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return (
      <main className="auth-page">
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

          <h1>Loading...</h1>

          <p className="auth-subtitle">
            Checking your account
          </p>
        </div>
      </main>
    );
  }

  /*
   * User is authenticated.
   * Show the main Social freeText application.
   */
  if (user) {
    return <>{children}</>;
  }

  /*
   * User is not authenticated.
   * Show the appropriate authentication screen.
   */

  if (screen === "signup") {
    return (
      <main className="auth-page">
        <div className="auth-background-glow glow-one" />
        <div className="auth-background-glow glow-two" />

        <SignupForm
          onSuccess={() => {
            // Firebase has already signed the user in.
            // onAuthStateChanged will update the UI.
          }}
          onLogin={() => setScreen("login")}
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
          onBack={() => setScreen("login")}
        />
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-background-glow glow-one" />
      <div className="auth-background-glow glow-two" />

      <LoginForm
        onSuccess={() => {
          // Firebase has already signed the user in.
          // onAuthStateChanged will update the UI.
        }}
        onForgotPassword={() => setScreen("forgot")}
        onCreateAccount={() => setScreen("signup")}
      />
    </main>
  );
}
