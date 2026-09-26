"use client";

import { useState } from "react";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  function sendOtp() {
    if (!phone.trim()) return;
    setShowOtp(true);
  }

  function verifyOtp() {
    if (otp.length !== 6) return;
    alert("Welcome to Social freeText!");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
            SF
          </div>

          <h1 className="text-3xl font-bold mt-4">
            Social <span className="text-blue-600">freeText</span>
          </h1>

          <p className="text-gray-500 mt-2">
            Connect. Chat. Share.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6">

          {!showOtp ? (
            <>
              <h2 className="text-2xl font-bold mb-2">
                Create your account
              </h2>

              <p className="text-gray-500 mb-6">
                Enter your phone number to get started.
              </p>

              <label className="text-sm font-semibold">
                Phone number
              </label>

              <div className="flex gap-2 mt-2">
                <div className="bg-gray-100 rounded-xl px-4 py-3">
                  +234
                </div>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="8012345678"
                  className="flex-1 bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={sendOtp}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
              >
                Send verification code
              </button>

              <p className="text-xs text-gray-400 text-center mt-5">
                By continuing, you agree to our Terms and Privacy Policy.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">
                Verify your number
              </h2>

              <p className="text-gray-500 mb-6">
                Enter the 6-digit code sent to your phone.
              </p>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                placeholder="000000"
                className="w-full bg-gray-100 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={verifyOtp}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
              >
                Verify & Continue
              </button>

              <button
                onClick={() => setShowOtp(false)}
                className="w-full mt-3 text-blue-600 py-2"
              >
                Change phone number
              </button>
            </>
          )}

        </div>

        {/* AI */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Powered by <span className="font-semibold text-blue-600">
            Boi AchiverAI
          </span>
        </div>

      </div>
    </main>
  );
}