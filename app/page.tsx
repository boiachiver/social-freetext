"use client";

import { ChangeEvent, useEffect, useState } from "react";

import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "../lib/firebase";

const countries = [
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
];

type Screen = "phone" | "otp" | "profile";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export default function Home() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [screen, setScreen] =
    useState<Screen>("phone");

  const [country, setCountry] =
    useState(countries[0]);

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] =
    useState(false);

  const [resendSeconds, setResendSeconds] =
    useState(0);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [profilePhoto, setProfilePhoto] =
    useState<string | null>(null);

  /*
   * ==========================================
   * RECAPTCHA
   * ==========================================
   */

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  function createRecaptcha() {
    if (window.recaptchaVerifier) {
      return window.recaptchaVerifier;
    }

    window.recaptchaVerifier =
      new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA verified");
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired");
          },
        }
      );

    return window.recaptchaVerifier;
  }

  /*
   * ==========================================
   * SEND FIREBASE SMS
   * ==========================================
   */

  async function sendOtp() {
    if (phone.trim().length < 7) {
      alert("Please enter a valid phone number.");
      return;
    }

    setLoading(true);

    try {
      const fullPhoneNumber =
        `${country.code}${phone}`;

      const verifier = createRecaptcha();

      const result =
        await signInWithPhoneNumber(
          auth,
          fullPhoneNumber,
          verifier
        );

      setConfirmationResult(result);
      setOtp("");
      setScreen("otp");

      setResendSeconds(60);

      alert(
        "Verification code sent successfully."
      );
    } catch (error: any) {
      console.error(error);

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }

      alert(
        error?.message ||
          "Unable to send verification code."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ==========================================
   * VERIFY FIREBASE OTP
   * ==========================================
   */

  async function verifyOtp() {
    if (otp.length !== 6) {
      alert(
        "Please enter the 6-digit verification code."
      );
      return;
    }

    if (!confirmationResult) {
      alert(
        "Please request a new verification code."
      );
      return;
    }

    setLoading(true);

    try {
      await confirmationResult.confirm(otp);

      setScreen("profile");

      alert(
        "Phone number verified successfully!"
      );
    } catch (error: any) {
      console.error(error);

      alert(
        "Incorrect verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ==========================================
   * RESEND CODE
   * ==========================================
   */

  async function resendCode() {
    if (resendSeconds > 0) {
      return;
    }

    setResendLoading(true);

    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }

      const fullPhoneNumber =
        `${country.code}${phone}`;

      const verifier = createRecaptcha();

      const result =
        await signInWithPhoneNumber(
          auth,
          fullPhoneNumber,
          verifier
        );

      setConfirmationResult(result);
      setOtp("");
      setResendSeconds(60);

      alert("New verification code sent.");
    } catch (error: any) {
      console.error(error);

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }

      alert(
        error?.message ||
          "Unable to resend verification code."
      );
    } finally {
      setResendLoading(false);
    }
  }

  /*
   * ==========================================
   * RESEND COUNTDOWN
   * ==========================================
   */

  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = setInterval(() => {
      setResendSeconds((seconds) =>
        seconds > 0 ? seconds - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [resendSeconds]);

  /*
   * ==========================================
   * PHOTO
   * ==========================================
   */

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Please choose an image smaller than 5MB."
      );
      return;
    }

    const imageUrl =
      URL.createObjectURL(file);

    setProfilePhoto(imageUrl);
  }

  /*
   * ==========================================
   * CREATE PROFILE
   * ==========================================
   */

  function createProfile() {
    const cleanUsername =
      username
        .trim()
        .replace(/^@/, "");

    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!cleanUsername) {
      alert("Please enter a username.");
      return;
    }

    if (cleanUsername.length < 3) {
      alert(
        "Username must contain at least 3 characters."
      );
      return;
    }

    alert(
      `Welcome to Social freeText, ${name.trim()}!`
    );
  }

  /*
   * ==========================================
   * COUNTRY
   * ==========================================
   */

  function changeCountry(value: string) {
    const selected = countries.find(
      (item, index) =>
        `${item.code}-${index}` === value
    );

    if (selected) {
      setCountry(selected);
      setPhone("");
    }
  }

  /*
   * ==========================================
   * CHANGE NUMBER
   * ==========================================
   */

  function changePhone() {
    setOtp("");
    setConfirmationResult(null);
    setScreen("phone");
  }

  return (
    <main
      className="
        min-h-screen
        bg-gray-100
        flex
        items-center
        justify-center
        p-4
      "
    >
      <div className="w-full max-w-md">

        {/* LOGO */}

        <div className="text-center mb-10">

          <div className="sf-logo">
            <div className="sf-ring"></div>
            <div className="sf-ring-two"></div>
            <div className="sf-shine"></div>
            <span>SF</span>
          </div>

          <h1
            className="
              text-3xl
              font-bold
              mt-9
              tracking-tight
            "
          >
            Social{" "}
            <span className="text-blue-600">
              freeText
            </span>
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Connect. Chat. Share.
          </p>

        </div>

        {/* CARD */}

        <div
          className="
            bg-white
            rounded-3xl
            shadow-xl
            p-6
          "
        >

          {/* PHONE */}

          {screen === "phone" && (
            <>
              <h2 className="text-2xl font-bold mb-2">
                Create your account
              </h2>

              <p className="text-gray-500 mb-6">
                Enter your phone number to get started.
              </p>

              <label
                htmlFor="country"
                className="text-sm font-semibold"
              >
                Country
              </label>

              <select
                id="country"
                value={`${country.code}-${countries.indexOf(
                  country
                )}`}
                onChange={(e) =>
                  changeCountry(e.target.value)
                }
                className="
                  w-full
                  mt-2
                  mb-4
                  bg-gray-100
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >
                {countries.map(
                  (item, index) => (
                    <option
                      key={`${item.code}-${index}`}
                      value={`${item.code}-${index}`}
                    >
                      {item.flag} {item.name} (
                      {item.code})
                    </option>
                  )
                )}
              </select>

              <label
                htmlFor="phone"
                className="text-sm font-semibold"
              >
                Phone number
              </label>

              <div className="flex gap-2 mt-2">

                <div
                  className="
                    bg-gray-100
                    rounded-xl
                    px-4
                    py-3
                    font-semibold
                    flex
                    items-center
                  "
                >
                  {country.code}
                </div>

                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  placeholder="Phone number"
                  className="
                    flex-1
                    min-w-0
                    bg-gray-100
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

              </div>

              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="
                  w-full
                  mt-6
                  bg-blue-600
                  text-white
                  py-3
                  rounded-xl
                  font-semibold
                  hover:bg-blue-700
                  disabled:opacity-50
                  transition
                  shadow-lg
                  shadow-blue-200
                "
              >
                {loading
                  ? "Sending code..."
                  : "Send verification code"}
              </button>
            </>
          )}

          {/* OTP */}

          {screen === "otp" && (
            <>
              <h2 className="text-2xl font-bold mb-2">
                Verify your number
              </h2>

              <p className="text-gray-500 mb-6">
                Enter the 6-digit code sent to:
              </p>

              <div
                className="
                  bg-blue-50
                  text-blue-700
                  rounded-xl
                  px-4
                  py-3
                  text-center
                  font-semibold
                  mb-6
                "
              >
                {country.flag}{" "}
                {country.code} {phone}
              </div>

              <label
                htmlFor="otp"
                className="text-sm font-semibold"
              >
                Verification code
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                placeholder="000000"
                className="
                  w-full
                  mt-2
                  bg-gray-100
                  rounded-xl
                  px-4
                  py-4
                  text-center
                  text-2xl
                  tracking-[0.5em]
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <button
                type="button"
                onClick={verifyOtp}
                disabled={loading}
                className="
                  w-full
                  mt-6
                  bg-blue-600
                  text-white
                  py-3
                  rounded-xl
                  font-semibold
                  hover:bg-blue-700
                  disabled:opacity-50
                  transition
                "
              >
                {loading
                  ? "Verifying..."
                  : "Verify & Continue"}
              </button>

              <button
                type="button"
                onClick={resendCode}
                disabled={
                  resendSeconds > 0 ||
                  resendLoading
                }
                className="
                  w-full
                  mt-3
                  text-blue-600
                  py-2
                  disabled:text-gray-400
                "
              >
                {resendLoading
                  ? "Sending..."
                  : resendSeconds > 0
                  ? `Resend code in ${resendSeconds}s`
                  : "Resend code"}
              </button>

              <button
                type="button"
                onClick={changePhone}
                className="
                  w-full
                  mt-1
                  text-gray-500
                  py-2
                  hover:text-blue-600
                "
              >
                Change phone number
              </button>
            </>
          )}

          {/* PROFILE */}

          {screen === "profile" && (
            <>
              <h2 className="text-2xl font-bold mb-2">
                Create your profile
              </h2>

              <p className="text-gray-500 mb-6">
                Tell people a little about yourself.
              </p>

              <div className="flex justify-center mb-3">

                <label className="relative cursor-pointer">

                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile preview"
                      className="
                        w-28
                        h-28
                        rounded-full
                        object-cover
                        border-4
                        border-white
                        shadow-lg
                      "
                    />
                  ) : (
                    <div
                      className="
                        w-28
                        h-28
                        rounded-full
                        bg-blue-100
                        text-blue-600
                        flex
                        items-center
                        justify-center
                        text-4xl
                        font-bold
                        border-4
                        border-white
                        shadow-lg
                      "
                    >
                      +
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handlePhotoChange
                    }
                    className="hidden"
                  />

                  <div
                    className="
                      absolute
                      bottom-0
                      right-0
                      w-9
                      h-9
                      rounded-full
                      bg-blue-600
                      text-white
                      flex
                      items-center
                      justify-center
                      border-4
                      border-white
                    "
                  >
                    📷
                  </div>

                </label>

              </div>

              <p
                className="
                  text-center
                  text-sm
                  text-gray-500
                  mb-6
                "
              >
                Tap the photo to upload
              </p>

              <label
                htmlFor="name"
                className="text-sm font-semibold"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Your name"
                className="
                  w-full
                  mt-2
                  mb-4
                  bg-gray-100
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <label
                htmlFor="username"
                className="text-sm font-semibold"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                      .replace(/\s/g, "")
                      .toLowerCase()
                  )
                }
                placeholder="@username"
                className="
                  w-full
                  mt-2
                  mb-4
                  bg-gray-100
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <label
                htmlFor="bio"
                className="text-sm font-semibold"
              >
                Bio
              </label>

              <textarea
                id="bio"
                value={bio}
                onChange={(e) =>
                  setBio(e.target.value)
                }
                placeholder="Tell people about yourself..."
                rows={3}
                maxLength={160}
                className="
                  w-full
                  mt-2
                  bg-gray-100
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  resize-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <p
                className="
                  text-xs
                  text-gray-400
                  text-right
                  mt-1
                "
              >
                {bio.length}/160
              </p>

              <button
                type="button"
                onClick={createProfile}
                className="
                  w-full
                  mt-5
                  bg-blue-600
                  text-white
                  py-3
                  rounded-xl
                  font-semibold
                  hover:bg-blue-700
                  transition
                "
              >
                Create Profile
              </button>
            </>
          )}
        </div>

        {/* INVISIBLE RECAPTCHA */}

        <div id="recaptcha-container"></div>

        {/* AI BRANDING */}

        <div
          className="
            text-center
            mt-6
            text-sm
            text-gray-500
          "
        >
          Powered by{" "}
          <span
            className="
              font-semibold
              text-blue-600
            "
          >
            Boi AchiverAI
          </span>
        </div>

      </div>
    </main>
  );
}