"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
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

export default function Home() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [screen, setScreen] = useState<Screen>("phone");

  const [country, setCountry] = useState(countries[0]);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [profilePhoto, setProfilePhoto] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [resendSeconds, setResendSeconds] = useState(0);

  const recaptchaVerifierRef =
    useRef<RecaptchaVerifier | null>(null);

  const confirmationResultRef =
    useRef<ConfirmationResult | null>(null);

  /*
   * ==========================================
   * RESEND COUNTDOWN
   * ==========================================
   */

  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = setInterval(() => {
      setResendSeconds((seconds) => seconds - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendSeconds]);

  /*
   * ==========================================
   * CLEAN ERROR
   * ==========================================
   */

  function getFirebaseError(error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error
    ) {
      const firebaseError = error as {
        code?: string;
        message?: string;
      };

      switch (firebaseError.code) {
        case "auth/invalid-phone-number":
          return "That phone number is not valid.";

        case "auth/too-many-requests":
          return "Too many attempts. Please wait and try again.";

        case "auth/quota-exceeded":
          return "SMS verification limit reached. Please try again later.";

        case "auth/invalid-verification-code":
          return "The verification code is incorrect.";

        case "auth/code-expired":
          return "This verification code has expired. Please request a new one.";

        case "auth/captcha-check-failed":
          return "reCAPTCHA verification failed. Please try again.";

        case "auth/network-request-failed":
          return "Network error. Please check your internet connection.";

        case "auth/missing-phone-number":
          return "Please enter your phone number.";

        default:
          return firebaseError.message || "Something went wrong. Please try again.";
      }
    }

    return "Something went wrong. Please try again.";
  }

  /*
   * ==========================================
   * CREATE RECAPTCHA
   * ==========================================
   */

  function createRecaptcha() {
    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }

    const verifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",

        callback: () => {
          // reCAPTCHA completed.
        },

        "expired-callback": () => {
          setError(
            "reCAPTCHA expired. Please try again."
          );
        },
      }
    );

    recaptchaVerifierRef.current = verifier;

    return verifier;
  }

  /*
   * ==========================================
   * SEND OTP
   * ==========================================
   */

  async function sendOtp() {
    if (phone.trim().length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const fullPhoneNumber =
        `${country.code}${phone}`;

      const appVerifier = createRecaptcha();

      const confirmationResult =
        await signInWithPhoneNumber(
          auth,
          fullPhoneNumber,
          appVerifier
        );

      confirmationResultRef.current =
        confirmationResult;

      setOtp("");
      setScreen("otp");

      setResendSeconds(60);

      setMessage(
        `Verification code sent to ${country.code} ${phone}`
      );
    } catch (error) {
      console.error(error);

      setError(getFirebaseError(error));

      /*
       * Firebase recommends resetting/clearing
       * the reCAPTCHA after a failed request.
       */

      try {
        recaptchaVerifierRef.current?.clear();
      } catch {
        // Ignore cleanup errors.
      }

      recaptchaVerifierRef.current = null;
    } finally {
      setLoading(false);
    }
  }

  /*
   * ==========================================
   * VERIFY OTP
   * ==========================================
   */

  async function verifyOtp() {
    if (otp.length !== 6) {
      setError(
        "Please enter the 6-digit verification code."
      );
      return;
    }

    if (!confirmationResultRef.current) {
      setError(
        "Your verification session has expired. Please request a new code."
      );
      setScreen("phone");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result =
        await confirmationResultRef.current.confirm(
          otp
        );

      console.log(
        "Firebase authenticated user:",
        result.user.uid
      );

      setScreen("profile");

      setMessage(
        "Phone number verified successfully!"
      );
    } catch (error) {
      console.error(error);

      setError(getFirebaseError(error));
    } finally {
      setLoading(false);
    }
  }

  /*
   * ==========================================
   * RESEND OTP
   * ==========================================
   */

  async function resendOtp() {
    if (resendSeconds > 0 || resendLoading) {
      return;
    }

    setResendLoading(true);
    setError("");
    setMessage("");

    try {
      /*
       * Destroy the old reCAPTCHA so Firebase
       * can create a fresh verification attempt.
       */

      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // Ignore cleanup errors.
        }

        recaptchaVerifierRef.current = null;
      }

      const fullPhoneNumber =
        `${country.code}${phone}`;

      const appVerifier = createRecaptcha();

      const confirmationResult =
        await signInWithPhoneNumber(
          auth,
          fullPhoneNumber,
          appVerifier
        );

      confirmationResultRef.current =
        confirmationResult;

      setOtp("");
      setResendSeconds(60);

      setMessage("A new verification code was sent.");
    } catch (error) {
      console.error(error);

      setError(getFirebaseError(error));

      try {
        recaptchaVerifierRef.current?.clear();
      } catch {
        // Ignore cleanup errors.
      }

      recaptchaVerifierRef.current = null;
    } finally {
      setResendLoading(false);
    }
  }

  /*
   * ==========================================
   * CHANGE PHONE
   * ==========================================
   */

  function changePhone() {
    setOtp("");
    setError("");
    setMessage("");
    setResendSeconds(0);

    confirmationResultRef.current = null;

    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch {
        // Ignore cleanup errors.
      }

      recaptchaVerifierRef.current = null;
    }

    setScreen("phone");
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
      setError("");
    }
  }

  /*
   * ==========================================
   * PROFILE PHOTO
   * ==========================================
   */

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Please choose an image smaller than 5MB."
      );
      return;
    }

    const imageUrl =
      URL.createObjectURL(file);

    setProfilePhoto(imageUrl);
    setError("");
  }

  /*
   * ==========================================
   * CREATE PROFILE
   * ==========================================
   */

  function createProfile() {
    const cleanUsername = username
      .trim()
      .replace(/^@/, "");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!cleanUsername) {
      setError("Please enter a username.");
      return;
    }

    if (cleanUsername.length < 3) {
      setError(
        "Username must contain at least 3 characters."
      );
      return;
    }

    alert(
      `Welcome to Social freeText, ${name.trim()}!`
    );
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

        {/* ========================================
            LOGO
            ======================================== */}

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

          <p
            className="
              text-gray-500
              mt-2
              text-sm
            "
          >
            Connect. Chat. Share.
          </p>

        </div>

        {/* ========================================
            MAIN CARD
            ======================================== */}

        <div
          className="
            bg-white
            rounded-3xl
            shadow-xl
            p-6
          "
        >

          {/* ======================================
              PHONE SCREEN
              ====================================== */}

          {screen === "phone" && (
            <>
              <h2
                className="
                  text-2xl
                  font-bold
                  mb-2
                "
              >
                Create your account
              </h2>

              <p
                className="
                  text-gray-500
                  mb-6
                "
              >
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
                {countries.map((item, index) => (
                  <option
                    key={`${item.code}-${index}`}
                    value={`${item.code}-${index}`}
                  >
                    {item.flag} {item.name} ({item.code})
                  </option>
                ))}
              </select>

              <label
                htmlFor="phone"
                className="text-sm font-semibold"
              >
                Phone number
              </label>

              <div
                className="
                  flex
                  gap-2
                  mt-2
                "
              >
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
                      e.target.value.replace(/\D/g, "")
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

              {error && (
                <div
                  className="
                    mt-4
                    rounded-xl
                    bg-red-50
                    text-red-600
                    px-4
                    py-3
                    text-sm
                  "
                >
                  {error}
                </div>
              )}

              <button
                id="send-code-button"
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
                  active:scale-[0.98]
                  transition
                  shadow-lg
                  shadow-blue-200
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {loading
                  ? "Sending code..."
                  : "Send verification code"}
              </button>
            </>
          )}

          {/* ======================================
              OTP SCREEN
              ====================================== */}

          {screen === "otp" && (
            <>
              <h2
                className="
                  text-2xl
                  font-bold
                  mb-2
                "
              >
                Verify your number
              </h2>

              <p
                className="
                  text-gray-500
                  mb-6
                "
              >
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

              {message && (
                <div
                  className="
                    mb-4
                    rounded-xl
                    bg-green-50
                    text-green-700
                    px-4
                    py-3
                    text-sm
                  "
                >
                  {message}
                </div>
              )}

              {error && (
                <div
                  className="
                    mb-4
                    rounded-xl
                    bg-red-50
                    text-red-600
                    px-4
                    py-3
                    text-sm
                  "
                >
                  {error}
                </div>
              )}

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
                    e.target.value.replace(/\D/g, "")
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
                  active:scale-[0.98]
                  transition
                  shadow-lg
                  shadow-blue-200
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {loading
                  ? "Verifying..."
                  : "Verify & Continue"}
              </button>

              {/* RESEND */}

              <button
                type="button"
                onClick={resendOtp}
                disabled={
                  resendSeconds > 0 ||
                  resendLoading
                }
                className="
                  w-full
                  mt-4
                  py-2
                  text-blue-600
                  font-semibold
                  hover:text-blue-800
                  disabled:text-gray-400
                  disabled:cursor-not-allowed
                "
              >
                {resendLoading
                  ? "Sending new code..."
                  : resendSeconds > 0
                  ? `Resend code in ${resendSeconds}s`
                  : "Resend code"}
              </button>

              <button
                type="button"
                onClick={changePhone}
                className="
                  w-full
                  mt-2
                  text-gray-500
                  py-2
                  hover:text-gray-700
                "
              >
                Change phone number
              </button>
            </>
          )}

          {/* ======================================
              PROFILE SCREEN
              ====================================== */}

          {screen === "profile" && (
            <>
              <h2
                className="
                  text-2xl
                  font-bold
                  mb-2
                "
              >
                Create your profile
              </h2>

              <p
                className="
                  text-gray-500
                  mb-6
                "
              >
                Your phone number has been verified.
                Now create your Social freeText profile.
              </p>

              <div
                className="
                  flex
                  justify-center
                  mb-3
                "
              >
                <label
                  className="
                    relative
                    cursor-pointer
                  "
                >
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
                    onChange={handlePhotoChange}
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
                      shadow-md
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

              {error && (
                <div
                  className="
                    mt-4
                    rounded-xl
                    bg-red-50
                    text-red-600
                    px-4
                    py-3
                    text-sm
                  "
                >
                  {error}
                </div>
              )}

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
                  active:scale-[0.98]
                  transition
                  shadow-lg
                  shadow-blue-200
                "
              >
                Create Profile
              </button>
            </>
          )}

          {/* Invisible reCAPTCHA container */}

          <div id="recaptcha-container"></div>
        </div>

        {/* ========================================
            BRANDING
            ======================================== */}

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