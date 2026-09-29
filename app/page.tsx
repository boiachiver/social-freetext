"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import {
  ArrowRight,
  Bell,
  Bot,
  Camera,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  FileText,
  Heart,
  Home,
  Image as ImageIcon,
  Lock,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  Sparkles,
  User,
  Users,
  Video,
  X,
} from "lucide-react";

type Screen =
  | "login"
  | "signup"
  | "forgot"
  | "profile"
  | "home"
  | "chats"
  | "status"
  | "communities"
  | "notifications"
  | "profilePage"
  | "settings";

type Message = {
  id: number;
  sender: "me" | "them";
  text: string;
  time: string;
  reaction?: string;
};

type Chat = {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  unread: number;
  lastMessage: string;
};

const chats: Chat[] = [
  {
    id: 1,
    name: "Andy Gill",
    avatar: "AG",
    online: true,
    unread: 2,
    lastMessage: "Good morning boo ❤️",
  },
  {
    id: 2,
    name: "Social freeText Team",
    avatar: "SF",
    online: true,
    unread: 5,
    lastMessage: "The new update is ready",
  },
  {
    id: 3,
    name: "Boi AchiverAI",
    avatar: "AI",
    online: true,
    unread: 0,
    lastMessage: "How can I help you today?",
  },
  {
    id: 4,
    name: "Design Community",
    avatar: "DC",
    online: false,
    unread: 0,
    lastMessage: "New design discussion",
  },
];

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "them",
    text: "Good morning boo ❤️",
    time: "9:20 AM",
  },
  {
    id: 2,
    sender: "me",
    text: "Good morning my love 😘 I hope you are having a beautiful day",
    time: "9:22 AM",
  },
  {
    id: 3,
    sender: "them",
    text: "I am doing good. I was thinking about you",
    time: "9:24 AM",
  },
];

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [messageText, setMessageText] = useState("");
  const [chatSearch, setChatSearch] = useState("");

  const [postText, setPostText] = useState("");

  const [notice, setNotice] = useState("");

  const showNotice = (message: string) => {
    setNotice(message);

    setTimeout(() => {
      setNotice("");
    }, 3000);
  };

  /*
   * FIREBASE LOGIN
   */

  const handleLogin = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      showNotice("Please enter your email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const user = userCredential.user;

      setEmail(user.email || cleanEmail);

      setName(
        user.displayName ||
          cleanEmail.split("@")[0] ||
          "Social freeText User"
      );

      setUsername(
        user.displayName?.replace(/\s/g, "").toLowerCase() ||
          cleanEmail.split("@")[0] ||
          "user"
      );

      setScreen("home");

      showNotice("Welcome back!");
    } catch (error: any) {
      console.error(error);

      switch (error.code) {
        case "auth/invalid-credential":
          showNotice("Incorrect email or password");
          break;

        case "auth/user-not-found":
          showNotice("No account exists with this email");
          break;

        case "auth/wrong-password":
          showNotice("Incorrect password");
          break;

        case "auth/invalid-email":
          showNotice("Please enter a valid email address");
          break;

        case "auth/too-many-requests":
          showNotice("Too many attempts. Please try again later.");
          break;

        default:
          showNotice("Unable to sign in. Please try again.");
      }
    }
  };

  /*
   * FIREBASE SIGNUP
   */

  const handleSignup = async () => {
    const cleanName = name.trim();
    const cleanUsername = username
      .trim()
      .replace(/^@/, "")
      .toLowerCase();
    const cleanEmail = email.trim();

    if (
      !cleanName ||
      !cleanUsername ||
      !cleanEmail ||
      !password ||
      !confirmPassword
    ) {
      showNotice("Please complete all required fields");
      return;
    }

    if (cleanUsername.length < 3) {
      showNotice("Username must contain at least 3 characters");
      return;
    }

    if (password.length < 6) {
      showNotice("Password must contain at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      showNotice("Passwords do not match");
      return;
    }

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

      setEmail(cleanEmail);
      setName(cleanName);
      setUsername(cleanUsername);

      setScreen("profile");

      showNotice("Account created successfully!");
    } catch (error: any) {
      console.error(error);

      switch (error.code) {
        case "auth/email-already-in-use":
          showNotice("An account already exists with this email");
          break;

        case "auth/invalid-email":
          showNotice("Please enter a valid email address");
          break;

        case "auth/weak-password":
          showNotice("Your password is too weak");
          break;

        default:
          showNotice("Unable to create account. Please try again.");
      }
    }
  };

  /*
   * PASSWORD RESET
   */

  const handlePasswordReset = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      showNotice("Please enter your email address");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);

      showNotice("Password reset email sent");
    } catch (error: any) {
      console.error(error);

      switch (error.code) {
        case "auth/invalid-email":
          showNotice("Please enter a valid email address");
          break;

        case "auth/user-not-found":
          showNotice("No account exists with this email");
          break;

        default:
          showNotice("Unable to send reset email");
      }
    }
  };

  /*
   * PROFILE
   */

  const finishProfile = async () => {
    const cleanName = name.trim();
    const cleanUsername = username
      .trim()
      .replace(/^@/, "")
      .toLowerCase();

    if (!cleanName || !cleanUsername) {
      showNotice("Please enter your name and username");
      return;
    }

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: cleanName,
        });
      }

      setName(cleanName);
      setUsername(cleanUsername);
      setScreen("home");

      showNotice("Welcome to Social freeText!");
    } catch (error) {
      console.error(error);
      showNotice("Profile could not be updated");
    }
  };

  /*
   * SEND MESSAGE
   */

  const sendMessage = () => {
    const text = messageText.trim();

    if (!text) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((current) => [...current, newMessage]);
    setMessageText("");
  };

  /*
   * CREATE POST
   */

  const createPost = () => {
    if (!postText.trim()) {
      showNotice("Write something before posting");
      return;
    }

    showNotice("Post created successfully");
    setPostText("");
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(chatSearch.toLowerCase())
  );

  /*
   * FIREBASE LOGOUT
   */

  const logout = async () => {
    try {
      await signOut(auth);

      setScreen("login");
      setCurrentChat(null);

      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setName("");
      setUsername("");
      setBio("");
      setProfilePhoto("");

      showNotice("You have been logged out");
    } catch (error) {
      console.error(error);
      showNotice("Unable to log out");
    }
  };

  /*
   * LOGIN SCREEN
   */

  if (screen === "login") {
    return (
      <AuthLayout>
        <div className="auth-card">
          <Logo />

          <h1>Welcome back</h1>

          <p className="auth-subtitle">
            Sign in to continue to Social freeText
          </p>

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

          <div className="form-group">
            <label>Password</label>

            <div className="input-wrapper">
              <Lock size={19} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
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

          <button
            className="forgot-button"
            onClick={() => setScreen("forgot")}
          >
            Forgot password?
          </button>

          <button
            className="primary-button"
            onClick={handleLogin}
          >
            Sign In
            <ArrowRight size={19} />
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            className="secondary-button"
            onClick={() => {
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              setScreen("signup");
            }}
          >
            Create New Account
          </button>

          <div className="auth-footer">
            Powered by <strong>Boi AchiverAI</strong>
          </div>
        </div>

        {notice && <Toast message={notice} />}
      </AuthLayout>
    );
  }

  /*
   * SIGNUP SCREEN
   */

  if (screen === "signup") {
    return (
      <AuthLayout>
        <div className="auth-card signup-card">
          <button
            className="back-button"
            onClick={() => setScreen("login")}
          >
            <ChevronLeft size={20} />
            Back to login
          </button>

          <Logo />

          <h1>Create account</h1>

          <p className="auth-subtitle">
            Join Social freeText and connect with everyone
          </p>

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
              <span className="username-symbol">@</span>

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
                  setConfirmPassword(
                    event.target.value
                  )
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
            onClick={handleSignup}
          >
            Create Account
            <ArrowRight size={19} />
          </button>

          <p className="terms-text">
            By creating an account, you agree to our
            Terms and Privacy Policy.
          </p>

          <div className="auth-footer">
            Powered by <strong>Boi AchiverAI</strong>
          </div>
        </div>

        {notice && <Toast message={notice} />}
      </AuthLayout>
    );
  }

  /*
   * FORGOT PASSWORD
   */

  if (screen === "forgot") {
    return (
      <AuthLayout>
        <div className="auth-card">
          <button
            className="back-button"
            onClick={() => setScreen("login")}
          >
            <ChevronLeft size={20} />
            Back to login
          </button>

          <Logo />

          <h1>Reset password</h1>

          <p className="auth-subtitle">
            Enter your email and we'll send you a
            password reset link.
          </p>

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
              />
            </div>
          </div>

          <button
            className="primary-button"
            onClick={handlePasswordReset}
          >
            Send Reset Link
            <Send size={19} />
          </button>

          <div className="auth-footer">
            Powered by <strong>Boi AchiverAI</strong>
          </div>
        </div>

        {notice && <Toast message={notice} />}
      </AuthLayout>
    );
  }

  /*
   * PROFILE CREATION
   */

  if (screen === "profile") {
    return (
      <AuthLayout>
        <div className="auth-card">
          <Logo />

          <h1>Create your profile</h1>

          <p className="auth-subtitle">
            Add a few details so people can recognize you.
          </p>

          <div className="profile-upload">
            <label className="profile-photo-button">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile preview"
                />
              ) : (
                <>
                  <Camera size={28} />
                  <span>Add photo</span>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  const file =
                    event.target.files?.[0];

                  if (!file) return;

                  if (
                    file.size >
                    5 * 1024 * 1024
                  ) {
                    showNotice(
                      "Image must be less than 5MB"
                    );
                    return;
                  }

                  const reader =
                    new FileReader();

                  reader.onload = () => {
                    setProfilePhoto(
                      reader.result as string
                    );
                  };

                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>

          <div className="form-group">
            <label>Name</label>

            <div className="input-wrapper">
              <User size={19} />

              <input
                type="text"
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
                value={username}
                onChange={(event) =>
                  setUsername(
                    event.target.value
                      .replace(/\s/g, "")
                      .toLowerCase()
                  )
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>

            <textarea
              className="textarea"
              placeholder="Tell people a little about yourself..."
              value={bio}
              onChange={(event) =>
                setBio(event.target.value)
              }
              rows={4}
            />
          </div>

          <button
            className="primary-button"
            onClick={finishProfile}
          >
            Enter Social freeText
            <ArrowRight size={19} />
          </button>
        </div>

        {notice && <Toast message={notice} />}
      </AuthLayout>
    );
  }

  /*
   * MAIN APPLICATION
   */

  return (
    <div className="app-shell">
      {notice && <Toast message={notice} />}

      <header className="top-header">
        <div className="brand-mini">
          <div className="brand-mini-logo">
            SF
          </div>

          <div>
            <strong>Social freeText</strong>
            <span>Connect. Chat. Share.</span>
          </div>
        </div>

        <div className="header-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search Social freeText"
          />
        </div>

        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() =>
              setScreen("notifications")
            }
          >
            <Bell size={21} />
            <span className="notification-dot" />
          </button>

          <button
            className="icon-button"
            onClick={() =>
              setScreen("settings")
            }
          >
            <Settings size={21} />
          </button>

          <button
            className="mini-profile"
            onClick={() =>
              setScreen("profilePage")
            }
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={name}
              />
            ) : (
              <span>
                {name.charAt(0).toUpperCase() ||
                  "U"}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="app-body">
        <aside className="desktop-sidebar">
          <Navigation
            screen={screen}
            setScreen={setScreen}
            onLogout={logout}
          />
        </aside>

        <main className="main-content">
          {screen === "home" && (
            <HomeScreen
              name={name}
              username={username}
              profilePhoto={profilePhoto}
              postText={postText}
              setPostText={setPostText}
              createPost={createPost}
              setScreen={setScreen}
            />
          )}

          {screen === "chats" && (
            <ChatsScreen
              chats={filteredChats}
              search={chatSearch}
              setSearch={setChatSearch}
              currentChat={currentChat}
              setCurrentChat={setCurrentChat}
              messages={messages}
              messageText={messageText}
              setMessageText={setMessageText}
              sendMessage={sendMessage}
              setMessages={setMessages}
              showNotice={showNotice}
            />
          )}

          {screen === "status" && (
            <StatusScreen />
          )}

          {screen === "communities" && (
            <CommunitiesScreen />
          )}

          {screen === "notifications" && (
            <NotificationsScreen />
          )}

          {screen === "profilePage" && (
            <ProfileScreen
              name={name}
              username={username}
              bio={bio}
              profilePhoto={profilePhoto}
              setScreen={setScreen}
            />
          )}

          {screen === "settings" && (
            <SettingsScreen
              email={email}
              onLogout={logout}
              showNotice={showNotice}
            />
          )}
        </main>
      </div>

      <nav className="mobile-nav">
        <NavButton
          active={screen === "home"}
          icon={<Home size={22} />}
          label="Home"
          onClick={() => setScreen("home")}
        />

        <NavButton
          active={screen === "chats"}
          icon={
            <MessageCircle size={22} />
          }
          label="Chats"
          onClick={() => setScreen("chats")}
        />

        <NavButton
          active={screen === "status"}
          icon={<Play size={22} />}
          label="Status"
          onClick={() => setScreen("status")}
        />

        <NavButton
          active={
            screen === "communities"
          }
          icon={<Users size={22} />}
          label="Groups"
          onClick={() =>
            setScreen("communities")
          }
        />

        <NavButton
          active={
            screen === "profilePage"
          }
          icon={<User size={22} />}
          label="Profile"
          onClick={() =>
            setScreen("profilePage")
          }
        />
      </nav>
    </div>
  );
}

/*
 * AUTH LAYOUT
 */

function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="auth-page">
      <div className="auth-background-glow glow-one" />
      <div className="auth-background-glow glow-two" />

      {children}
    </main>
  );
}

/*
 * LOGO
 */

function Logo() {
  return (
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
  );
}

/*
 * NAVIGATION
 */

function Navigation({
  screen,
  setScreen,
  onLogout,
}: {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  onLogout: () => void;
}) {
  return (
    <div className="navigation">
      <button
        className={`nav-item ${
          screen === "home" ? "active" : ""
        }`}
        onClick={() =>
          setScreen("home")
        }
      >
        <Home size={21} />
        <span>Home</span>
      </button>

      <button
        className={`nav-item ${
          screen === "chats" ? "active" : ""
        }`}
        onClick={() =>
          setScreen("chats")
        }
      >
        <MessageCircle size={21} />
        <span>Chats</span>
        <b>2</b>
      </button>

      <button
        className={`nav-item ${
          screen === "status" ? "active" : ""
        }`}
        onClick={() =>
          setScreen("status")
        }
      >
        <Play size={21} />
        <span>Status</span>
      </button>

      <button
        className={`nav-item ${
          screen === "communities"
            ? "active"
            : ""
        }`}
        onClick={() =>
          setScreen("communities")
        }
      >
        <Users size={21} />
        <span>Communities</span>
      </button>

      <button
        className={`nav-item ${
          screen === "notifications"
            ? "active"
            : ""
        }`}
        onClick={() =>
          setScreen("notifications")
        }
      >
        <Bell size={21} />
        <span>Notifications</span>
      </button>

      <div className="nav-divider" />

      <button
        className={`nav-item ${
          screen === "profilePage"
            ? "active"
            : ""
        }`}
        onClick={() =>
          setScreen("profilePage")
        }
      >
        <User size={21} />
        <span>Profile</span>
      </button>

      <button
        className={`nav-item ${
          screen === "settings"
            ? "active"
            : ""
        }`}
        onClick={() =>
          setScreen("settings")
        }
      >
        <Settings size={21} />
        <span>Settings</span>
      </button>

      <button
        className="nav-item ai-nav"
        onClick={() =>
          alert(
            "Boi AchiverAI is coming next!"
          )
        }
      >
        <Bot size={21} />
        <span>Boi AchiverAI</span>
      </button>

      <div className="nav-spacer" />

      <button
        className="nav-item logout-nav"
        onClick={onLogout}
      >
        <X size={21} />
        <span>Log out</span>
      </button>
    </div>
  );
}

/*
 * HOME
 */

function HomeScreen({
  name,
  username,
  profilePhoto,
  postText,
  setPostText,
  createPost,
  setScreen,
}: {
  name: string;
  username: string;
  profilePhoto: string;
  postText: string;
  setPostText: (value: string) => void;
  createPost: () => void;
  setScreen: (screen: Screen) => void;
}) {
  return (
    <div className="content-container">
      <div className="page-heading">
        <div>
          <h1>Home</h1>
          <p>
            Welcome back,{" "}
            {name || "friend"} 👋
          </p>
        </div>

        <button
          className="ai-button"
          onClick={() =>
            alert(
              "Boi AchiverAI is coming next!"
            )
          }
        >
          <Sparkles size={18} />
          Ask Boi AchiverAI
        </button>
      </div>

      <div className="composer-card">
        <div className="composer-avatar">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={name}
            />
          ) : (
            name.charAt(0).toUpperCase() ||
            "U"
          )}
        </div>

        <div className="composer-main">
          <textarea
            placeholder={`What's on your mind, ${
              name || "friend"
            }?`}
            value={postText}
            onChange={(event) =>
              setPostText(event.target.value)
            }
          />

          <div className="composer-bottom">
            <div className="composer-tools">
              <button>
                <ImageIcon size={19} />
                Photo
              </button>

              <button>
                <Video size={19} />
                Video
              </button>

              <button>
                <FileText size={19} />
                File
              </button>
            </div>

            <button
              className="post-button"
              onClick={createPost}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      <div className="story-row">
        <div className="story-add">
          <div className="story-add-icon">
            <Plus size={24} />
          </div>

          <span>Your story</span>
        </div>

        {["AG", "SF", "AI", "DC"].map(
          (item) => (
            <div
              className="story-item"
              key={item}
            >
              <div className="story-avatar">
                {item}
              </div>

              <span>{item}</span>
            </div>
          )
        )}
      </div>

      <PostCard
        avatar="AG"
        name="Andy Gill"
        username="@andygill"
        time="12 min"
        text="Good morning everyone ❤️ Hope everyone is having a beautiful day."
      />

      <PostCard
        avatar="SF"
        name="Social freeText"
        username="@socialfreetext"
        time="1 hr"
        text="Connect. Chat. Share. 🚀 Social freeText is growing every day."
      />

      <PostCard
        avatar="AI"
        name="Boi AchiverAI"
        username="@boiachiverai"
        time="2 hrs"
        text="Your intelligent assistant is getting ready to help you create, learn and connect."
      />

      <div className="quick-links">
        <button
          onClick={() =>
            setScreen("chats")
          }
        >
          <MessageCircle size={22} />
          Open Chats
        </button>

        <button
          onClick={() =>
            setScreen("communities")
          }
        >
          <Users size={22} />
          Explore Communities
        </button>

        <button
          onClick={() =>
            setScreen("status")
          }
        >
          <Play size={22} />
          View Status
        </button>
      </div>
    </div>
  );
}

/*
 * POST CARD
 */

function PostCard({
  avatar,
  name,
  username,
  time,
  text,
}: {
  avatar: string;
  name: string;
  username: string;
  time: string;
  text: string;
}) {
  const [liked, setLiked] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [likes, setLikes] =
    useState(24);

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="post-avatar">
          {avatar}
        </div>

        <div className="post-author">
          <strong>{name}</strong>

          <span>
            {username} · {time}
          </span>
        </div>

        <button className="more-button">
          <MoreHorizontal size={21} />
        </button>
      </div>

      <p className="post-text">
        {text}
      </p>

      <div className="post-actions">
        <button
          className={
            liked ? "liked" : ""
          }
          onClick={() => {
            setLiked(!liked);

            setLikes(
              liked
                ? likes - 1
                : likes + 1
            );
          }}
        >
          <Heart
            size={20}
            fill={
              liked
                ? "currentColor"
                : "none"
            }
          />

          {likes}
        </button>

        <button>
          <MessageCircle size={20} />
          8
        </button>

        <button>
          <Share2 size={20} />
          Share
        </button>

        <button
          className={
            saved ? "saved" : ""
          }
          onClick={() =>
            setSaved(!saved)
          }
        >
          <Check size={20} />

          {saved
            ? "Saved"
            : "Save"}
        </button>
      </div>
    </article>
  );
}

/*
 * CHATS
 */

function ChatsScreen({
  chats,
  search,
  setSearch,
  currentChat,
  setCurrentChat,
  messages,
  messageText,
  setMessageText,
  sendMessage,
  showNotice,
}: {
  chats: Chat[];
  search: string;
  setSearch: (value: string) => void;
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat | null) => void;
  messages: Message[];
  messageText: string;
  setMessageText: (value: string) => void;
  sendMessage: () => void;
  setMessages: React.Dispatch<
    React.SetStateAction<Message[]>
  >;
  showNotice: (message: string) => void;
}) {
  return (
    <div className="chat-layout">
      <div
        className={`chat-list ${
          currentChat
            ? "mobile-hidden"
            : ""
        }`}
      >
        <div className="chat-list-header">
          <div>
            <h1>Chats</h1>
            <span>
              Stay connected
            </span>
          </div>

          <button className="new-chat-button">
            <Plus size={20} />
          </button>
        </div>

        <div className="chat-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search chats"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>

        <div className="chat-items">
          {chats.map((chat) => (
            <button
              className={`chat-item ${
                currentChat?.id ===
                chat.id
                  ? "selected"
                  : ""
              }`}
              key={chat.id}
              onClick={() =>
                setCurrentChat(chat)
              }
            >
              <div className="chat-avatar-wrapper">
                <div className="chat-avatar">
                  {chat.avatar}
                </div>

                {chat.online && (
                  <span className="online-dot" />
                )}
              </div>

              <div className="chat-item-info">
                <div className="chat-item-top">
                  <strong>
                    {chat.name}
                  </strong>

                  <span>Now</span>
                </div>

                <div className="chat-item-bottom">
                  <p>
                    {chat.lastMessage}
                  </p>

                  {chat.unread > 0 && (
                    <b className="unread-count">
                      {chat.unread}
                    </b>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {currentChat ? (
        <div className="chat-window">
          <div className="chat-window-header">
            <button
              className="chat-back-button"
              onClick={() =>
                setCurrentChat(null)
              }
            >
              <ChevronLeft size={22} />
            </button>

            <div className="chat-avatar">
              {currentChat.avatar}
            </div>

            <div className="chat-window-user">
              <strong>
                {currentChat.name}
              </strong>

              <span>
                {currentChat.online
                  ? "Online"
                  : "Offline"}
              </span>
            </div>

            <div className="chat-window-actions">
              <button
                onClick={() =>
                  showNotice(
                    "Voice calling will be connected next"
                  )
                }
              >
                <MessageCircle size={20} />
              </button>

              <button
                onClick={() =>
                  showNotice(
                    "Video calling will be connected next"
                  )
                }
              >
                <Video size={20} />
              </button>

              <button>
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          <div className="messages-area">
            <div className="chat-date">
              Today
            </div>

            {messages.map(
              (message) => (
                <div
                  className={`message-row ${
                    message.sender ===
                    "me"
                      ? "mine"
                      : "theirs"
                  }`}
                  key={message.id}
                >
                  <div className="message-bubble">
                    <p>
                      {message.text}
                    </p>

                    <span>
                      {message.time}

                      {message.sender ===
                        "me" &&
                        " ✓✓"}
                    </span>

                    {message.reaction && (
                      <small>
                        {
                          message.reaction
                        }
                      </small>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="message-composer">
            <button
              onClick={() =>
                showNotice(
                  "Attachment upload will be connected next"
                )
              }
            >
              <Plus size={22} />
            </button>

            <input
              type="text"
              placeholder="Write a message..."
              value={messageText}
              onChange={(event) =>
                setMessageText(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  sendMessage();
                }
              }}
            />

            <button
              onClick={() =>
                showNotice(
                  "Voice notes will be connected next"
                )
              }
            >
              <MessageCircle size={21} />
            </button>

            <button
              className="send-message"
              onClick={sendMessage}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-chat">
          <div className="empty-chat-icon">
            <MessageCircle size={42} />
          </div>

          <h2>
            Select a chat
          </h2>

          <p>
            Choose a conversation to
            start messaging.
          </p>
        </div>
      )}
    </div>
  );
}

/*
 * STATUS
 */

function StatusScreen() {
  return (
    <div className="content-container">
      <div className="page-heading">
        <div>
          <h1>Status</h1>

          <p>
            Share moments with your
            connections.
          </p>
        </div>

        <button className="primary-small-button">
          <Plus size={18} />
          Add Status
        </button>
      </div>

      <div className="status-grid">
        <div className="status-card add-status">
          <div className="status-add-circle">
            <Plus size={28} />
          </div>

          <strong>
            Add your status
          </strong>

          <span>
            Share a photo, video or text
          </span>
        </div>

        {[
          ["AG", "Andy Gill", "12 min"],
          [
            "SF",
            "Social freeText",
            "32 min",
          ],
          [
            "AI",
            "Boi AchiverAI",
            "1 hr",
          ],
          [
            "DC",
            "Design Community",
            "2 hrs",
          ],
        ].map(
          ([avatar, title, time]) => (
            <div
              className="status-card"
              key={title}
            >
              <div className="status-avatar">
                {avatar}
              </div>

              <strong>
                {title}
              </strong>

              <span>{time}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

/*
 * COMMUNITIES
 */

function CommunitiesScreen() {
  return (
    <div className="content-container">
      <div className="page-heading">
        <div>
          <h1>
            Communities
          </h1>

          <p>
            Find people who share your
            interests.
          </p>
        </div>

        <button className="primary-small-button">
          <Plus size={18} />
          Create
        </button>
      </div>

      <div className="community-grid">
        {[
          [
            "🎨",
            "Creative Designers",
            "12.4K members",
          ],
          [
            "💻",
            "Developers Hub",
            "25.8K members",
          ],
          [
            "🎵",
            "Music Lovers",
            "18.2K members",
          ],
          [
            "📚",
            "Students Community",
            "9.7K members",
          ],
          [
            "📸",
            "Photography",
            "15.3K members",
          ],
          [
            "🚀",
            "Entrepreneurs",
            "21.5K members",
          ],
        ].map(
          ([emoji, title, members]) => (
            <div
              className="community-card"
              key={title}
            >
              <div className="community-icon">
                {emoji}
              </div>

              <div>
                <strong>
                  {title}
                </strong>

                <span>
                  {members}
                </span>
              </div>

              <button>
                Join
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

/*
 * NOTIFICATIONS
 */

function NotificationsScreen() {
  const notifications = [
    [
      "AG",
      "Andy Gill liked your post",
      "5 min ago",
    ],
    [
      "SF",
      "Social freeText mentioned you",
      "20 min ago",
    ],
    [
      "AI",
      "Boi AchiverAI has a new update",
      "1 hr ago",
    ],
    [
      "DC",
      "You have a new community invitation",
      "2 hrs ago",
    ],
  ];

  return (
    <div className="content-container">
      <div className="page-heading">
        <div>
          <h1>
            Notifications
          </h1>

          <p>
            Stay updated with what's
            happening.
          </p>
        </div>
      </div>

      <div className="notifications-list">
        {notifications.map(
          ([avatar, text, time]) => (
            <div
              className="notification-item"
              key={text}
            >
              <div className="notification-avatar">
                {avatar}
              </div>

              <div>
                <strong>
                  {text}
                </strong>

                <span>
                  {time}
                </span>
              </div>

              <button>
                <MoreHorizontal size={20} />
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

/*
 * PROFILE
 */

function ProfileScreen({
  name,
  username,
  bio,
  profilePhoto,
  setScreen,
}: {
  name: string;
  username: string;
  bio: string;
  profilePhoto: string;
  setScreen: (screen: Screen) => void;
}) {
  return (
    <div className="content-container">
      <div className="profile-cover">
        <div className="profile-large-avatar">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={name}
            />
          ) : (
            name.charAt(0).toUpperCase() ||
            "U"
          )}
        </div>
      </div>

      <div className="profile-info">
        <div className="profile-info-top">
          <div>
            <h1>
              {name ||
                "Social freeText User"}
            </h1>

            <span>
              @{username || "user"}
            </span>
          </div>

          <button
            className="secondary-small-button"
            onClick={() =>
              setScreen("settings")
            }
          >
            Edit Profile
          </button>
        </div>

        <p>
          {bio ||
            "Welcome to my Social freeText profile."}
        </p>

        <div className="profile-stats">
          <div>
            <strong>128</strong>
            <span>Posts</span>
          </div>

          <div>
            <strong>1.2K</strong>
            <span>Followers</span>
          </div>

          <div>
            <strong>348</strong>
            <span>Following</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button className="active">
          Posts
        </button>

        <button>
          Media
        </button>

        <button>
          Likes
        </button>
      </div>

      <PostCard
        avatar={
          name.charAt(0).toUpperCase() ||
          "U"
        }
        name={
          name ||
          "Social freeText User"
        }
        username={`@${
          username || "user"
        }`}
        time="Today"
        text="Welcome to my Social freeText profile 🚀"
      />
    </div>
  );
}

/*
 * SETTINGS
 */

function SettingsScreen({
  email,
  onLogout,
  showNotice,
}: {
  email: string;
  onLogout: () => void;
  showNotice: (message: string) => void;
}) {
  return (
    <div className="content-container settings-page">
      <div className="page-heading">
        <div>
          <h1>Settings</h1>

          <p>
            Manage your Social freeText
            account.
          </p>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-section">
          <div className="settings-icon">
            <Mail size={21} />
          </div>

          <div>
            <strong>
              Email address
            </strong>

            <span>
              {email ||
                "No email available"}
            </span>
          </div>

          <button
            onClick={() =>
              showNotice(
                "Email settings will be connected next"
              )
            }
          >
            Change
          </button>
        </div>

        <div className="settings-section">
          <div className="settings-icon">
            <Lock size={21} />
          </div>

          <div>
            <strong>
              Password
            </strong>

            <span>
              ••••••••
            </span>
          </div>

          <button
            onClick={() =>
              showNotice(
                "Use Forgot Password to change your password"
              )
            }
          >
            Change
          </button>
        </div>

        <div className="settings-section">
          <div className="settings-icon">
            <Shield size={21} />
          </div>

          <div>
            <strong>
              Security
            </strong>

            <span>
              Account security and login
              settings
            </span>
          </div>

          <button
            onClick={() =>
              showNotice(
                "Security settings coming next"
              )
            }
          >
            Open
          </button>
        </div>

        <div className="settings-section">
          <div className="settings-icon">
            <Bell size={21} />
          </div>

          <div>
            <strong>
              Notifications
            </strong>

            <span>
              Manage notification
              preferences
            </span>
          </div>

          <button
            onClick={() =>
              showNotice(
                "Notification settings coming next"
              )
            }
          >
            Open
          </button>
        </div>

        <div className="settings-section danger">
          <div className="settings-icon">
            <X size={21} />
          </div>

          <div>
            <strong>
              Log out
            </strong>

            <span>
              Sign out of this account
            </span>
          </div>

          <button onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

/*
 * NAV BUTTON
 */

function NavButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`mobile-nav-button ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/*
 * TOAST
 */

function Toast({
  message,
}: {
  message: string;
}) {
  return (
    <div className="toast">
      <Check size={18} />
      {message}
    </div>
  );
}