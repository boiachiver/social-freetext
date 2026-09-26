"use client";

import { ChangeEvent, useState } from "react";

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

export default function Home() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [screen, setScreen] = useState<
    "phone" | "otp" | "profile"
  >("phone");

  const [country, setCountry] = useState(countries[0]);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  function sendOtp() {
    if (!phone.trim()) return;

    setScreen("otp");
  }

  function verifyOtp() {
    if (otp.length !== 6) return;

    setScreen("profile");
  }

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setProfilePhoto(imageUrl);
  }

  function createProfile() {
    if (!name.trim() || !username.trim()) {
      alert("Please enter your name and username.");
      return;
    }

    alert(`Welcome to Social freeText, ${name}!`);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
            SF
          </div>

          <h1 className="text-3xl font-bold mt-4">
            Social{" "}
            <span className="text-blue-600">
              freeText
            </span>
          </h1>

          <p className="text-gray-500 mt-2">
            Connect. Chat. Share.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-6">

          {/* PHONE SCREEN */}
          {screen === "phone" && (
            <>
              <h2 className="text-2xl font-bold mb-2">
                Create your account
              </h2>

              <p className="text-gray-500 mb-6">
                Enter your phone number to get started.
              </p>

              <label className="text-sm font-semibold">
                Country
              </label>

              <select
                value={country.code}
                onChange={(e) => {
                  const selected = countries.find(
                    (item) =>
                      item.code === e.target.value
                  );

                  if (selected) {
                    setCountry(selected);
                  }
                }}
                className="w-full mt-2 mb-4 bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countries.map((item, index) => (
                  <option
                    key={`${item.code}-${index}`}
                    value={item.code}
                  >
                    {item.flag} {item.name} ({item.code})
                  </option>
                ))}
              </select>

              <label className="text-sm font-semibold">
                Phone number
              </label>

              <div className="flex gap-2 mt-2">
                <div className="bg-gray-100 rounded-xl px-4 py-3 font-semibold">
                  {country.code}
                </div>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  placeholder="Phone number"
                  className="flex-1 bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={sendOtp}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
              >
                Send verification code
              </button>
            </>
          )}

          {/* OTP SCREEN */}
          {screen === "otp" && (
            <>
              <h2 className="text-2xl font-bold mb-2">
                Verify your number
              </h2>

              <p className="text-gray-500 mb-6">
                Enter the 6-digit code sent to:
              </p>

              <p className="font-semibold text-center mb-6">
                {country.code} {phone}
              </p>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
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
                onClick={() => {
                  setOtp("");
                  setScreen("phone");
                }}
                className="w-full mt-3 text-blue-600 py-2"
              >
                Change phone number
              </button>
            </>
          )}

          {/* PROFILE SCREEN */}
          {screen === "profile" && (
            <>
              <h2 className="text-2xl font-bold mb-2">
                Create your profile
              </h2>

              <p className="text-gray-500 mb-6">
                Tell people a little about yourself.
              </p>

              {/* PROFILE PHOTO */}
              <div className="flex justify-center mb-3">
                <label className="relative cursor-pointer">

                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile preview"
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
                      +
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-white">
                    📷
                  </div>
                </label>
              </div>

              <p className="text-center text-sm text-gray-500 mb-6">
                Tap the photo to upload
              </p>

              {/* NAME */}
              <label className="text-sm font-semibold">
                Full name
              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Your name"
                className="w-full mt-2 mb-4 bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* USERNAME */}
              <label className="text-sm font-semibold">
                Username
              </label>

              <input
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="@username"
                className="w-full mt-2 mb-4 bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* BIO */}
              <label className="text-sm font-semibold">
                Bio
              </label>

              <textarea
                value={bio}
                onChange={(e) =>
                  setBio(e.target.value)
                }
                placeholder="Tell people about yourself..."
                rows={3}
                maxLength={160}
                className="w-full mt-2 bg-gray-100 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-xs text-gray-400 text-right mt-1">
                {bio.length}/160
              </p>

              <button
                onClick={createProfile}
                className="w-full mt-5 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
              >
                Create Profile
              </button>
            </>
          )}

        </div>

        {/* AI BRANDING */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Powered by{" "}
          <span className="font-semibold text-blue-600">
            Boi AchiverAI
          </span>
        </div>

      </div>
    </main>
  );
}