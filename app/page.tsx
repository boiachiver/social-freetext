"use client";

import { useState } from "react";
import {
  Home,
  MessageCircle,
  CirclePlay,
  Users,
  Bell,
  User,
  Plus,
  Search,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  Music,
  Sparkles,
  Settings,
} from "lucide-react";

type Tab =
  | "home"
  | "chats"
  | "status"
  | "communities"
  | "notifications"
  | "profile";

const posts = [
  {
    id: 1,
    name: "Boi Achiver",
    username: "@boiachiver",
    time: "2h",
    text: "Welcome to Social freeText 🚀 Connect. Chat. Share.",
    likes: 128,
    comments: 24,
    shares: 8,
  },
  {
    id: 2,
    name: "Social freeText",
    username: "@socialfreetext",
    time: "5h",
    text: "Your new social experience starts here ✨",
    likes: 256,
    comments: 41,
    shares: 17,
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [postText, setPostText] = useState("");
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedPosts((current) =>
      current.includes(id)
        ? current.filter((postId) => postId !== id)
        : [...current, id]
    );
  };

  const toggleSave = (id: number) => {
    setSavedPosts((current) =>
      current.includes(id)
        ? current.filter((postId) => postId !== id)
        : [...current, id]
    );
  };

  const navigation = [
    { id: "home" as Tab, label: "Home", icon: Home },
    { id: "chats" as Tab, label: "Chats", icon: MessageCircle },
    { id: "status" as Tab, label: "Status", icon: CirclePlay },
    { id: "communities" as Tab, label: "Communities", icon: Users },
    {
      id: "notifications" as Tab,
      label: "Notifications",
      icon: Bell,
    },
    { id: "profile" as Tab, label: "Profile", icon: User },
  ];

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="mini-logo">SF</div>

          <div>
            <h1>Social freeText</h1>
            <span>Connect. Chat. Share.</span>
          </div>
        </div>

        <div className="top-actions">
          <button className="icon-button" aria-label="Search">
            <Search size={21} />
          </button>

          <button className="icon-button" aria-label="Settings">
            <Settings size={21} />
          </button>

          <button className="avatar">BA</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-nav">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  className={`nav-item ${
                    activeTab === item.id ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={21} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            className="ai-button"
            onClick={() => alert("Boi AchiverAI is coming next!")}
          >
            <Sparkles size={20} />
            <span>Boi AchiverAI</span>
          </button>

          <div className="sidebar-footer">
            Powered by Boi AchiverAI
          </div>
        </aside>

        <section className="content">
          {activeTab === "home" && (
            <>
              <div className="welcome-card">
                <div>
                  <p className="small-label">WELCOME BACK</p>
                  <h2>What&apos;s happening?</h2>
                  <p>
                    Share something with your Social freeText community.
                  </p>
                </div>

                <div className="welcome-icon">
                  <Sparkles size={30} />
                </div>
              </div>

              <div className="create-post">
                <div className="create-top">
                  <div className="avatar large">BA</div>

                  <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="What&apos;s on your mind?"
                    rows={2}
                  />
                </div>

                <div className="create-bottom">
                  <div className="media-actions">
                    <button>
                      <ImageIcon size={19} />
                      Photo
                    </button>

                    <button>
                      <Video size={19} />
                      Video
                    </button>

                    <button>
                      <Music size={19} />
                      Music
                    </button>
                  </div>

                  <button
                    className="post-button"
                    disabled={!postText.trim()}
                    onClick={() => {
                      setPostText("");
                      alert("Post created!");
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>

              <div className="section-title">
                <h2>Latest Posts</h2>

                <button className="more-button">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="feed">
                {posts.map((post) => {
                  const liked = likedPosts.includes(post.id);
                  const saved = savedPosts.includes(post.id);

                  return (
                    <article className="post-card" key={post.id}>
                      <div className="post-header">
                        <div className="avatar">{post.name[0]}</div>

                        <div className="post-author">
                          <strong>{post.name}</strong>
                          <span>
                            {post.username} · {post.time}
                          </span>
                        </div>

                        <button className="more-button">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>

                      <p className="post-text">{post.text}</p>

                      <div className="post-actions">
                        <button
                          className={liked ? "liked" : ""}
                          onClick={() => toggleLike(post.id)}
                        >
                          <Heart
                            size={19}
                            fill={liked ? "currentColor" : "none"}
                          />
                          {post.likes + (liked ? 1 : 0)}
                        </button>

                        <button>
                          <MessageSquare size={19} />
                          {post.comments}
                        </button>

                        <button>
                          <Share2 size={19} />
                          {post.shares}
                        </button>

                        <button
                          className={saved ? "saved" : ""}
                          onClick={() => toggleSave(post.id)}
                        >
                          <Bookmark
                            size={19}
                            fill={saved ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === "chats" && (
            <div className="empty-page">
              <MessageCircle size={55} />
              <h2>Chats</h2>
              <p>Your conversations will appear here.</p>

              <button className="primary-button">
                <Plus size={19} />
                Start a chat
              </button>
            </div>
          )}

          {activeTab === "status" && (
            <div className="empty-page">
              <CirclePlay size={55} />
              <h2>Status</h2>
              <p>Share photos, videos, music and updates.</p>

              <button className="primary-button">
                <Plus size={19} />
                Create Status
              </button>
            </div>
          )}

          {activeTab === "communities" && (
            <div className="empty-page">
              <Users size={55} />
              <h2>Communities</h2>
              <p>Create and join communities around your interests.</p>

              <button className="primary-button">
                <Plus size={19} />
                Create Community
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="empty-page">
              <Bell size={55} />
              <h2>Notifications</h2>
              <p>Your latest notifications will appear here.</p>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="profile-page">
              <div className="profile-cover"></div>

              <div className="profile-info">
                <div className="profile-avatar">BA</div>

                <h2>Boi Achiver</h2>
                <p>@boiachiver</p>

                <p className="bio">
                  Building Social freeText 🚀
                  <br />
                  Connect. Chat. Share.
                </p>

                <button className="secondary-button">
                  Edit Profile
                </button>
              </div>

              <div className="profile-stats">
                <div>
                  <strong>0</strong>
                  <span>Posts</span>
                </div>

                <div>
                  <strong>0</strong>
                  <span>Followers</span>
                </div>

                <div>
                  <strong>0</strong>
                  <span>Following</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <nav className="mobile-nav">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={activeTab === item.id ? "active" : ""}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={21} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </main>
  );
}