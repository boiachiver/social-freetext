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
  Phone,
  VideoIcon,
  Send,
  Smile,
  Paperclip,
  Mic,
  ArrowLeft,
  Check,
  CheckCheck,
  Reply,
  Forward,
  Trash2,
} from "lucide-react";

type Tab =
  | "home"
  | "chats"
  | "status"
  | "communities"
  | "notifications"
  | "profile";

type Conversation = {
  id: number;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

type Message = {
  id: number;
  sender: "me" | "them";
  text: string;
  time: string;
  reaction?: string;
};

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Andy Gill",
    initials: "AG",
    lastMessage: "Good morning boo ❤️",
    time: "10:42 AM",
    unread: 3,
    online: true,
  },
  {
    id: 2,
    name: "Social freeText Team",
    initials: "SF",
    lastMessage: "The new update is ready",
    time: "9:18 AM",
    unread: 1,
    online: true,
  },
  {
    id: 3,
    name: "Boi AchiverAI",
    initials: "AI",
    lastMessage: "How can I help you?",
    time: "Yesterday",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: "Design Community",
    initials: "DC",
    lastMessage: "New design ideas posted",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
];

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "them",
    text: "Good morning boo ❤️",
    time: "10:40 AM",
  },
  {
    id: 2,
    sender: "me",
    text: "Good morning my love 😊 How are you doing today?",
    time: "10:41 AM",
  },
  {
    id: 3,
    sender: "them",
    text: "I'm doing good. I was thinking about you.",
    time: "10:42 AM",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [postText, setPostText] = useState("");
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);

  const [selectedChat, setSelectedChat] =
    useState<Conversation | null>(null);

  const [messages, setMessages] =
    useState<Message[]>(initialMessages);

  const [messageText, setMessageText] = useState("");
  const [searchChat, setSearchChat] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

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
    setReplyingTo(null);
  };

  const addReaction = (messageId: number, reaction: string) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId
          ? { ...message, reaction }
          : message
      )
    );
  };

  const deleteMessage = (messageId: number) => {
    setMessages((current) =>
      current.filter((message) => message.id !== messageId)
    );
  };

  const filteredChats = conversations.filter((chat) =>
    chat.name.toLowerCase().includes(searchChat.toLowerCase())
  );

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
          <button className="icon-button">
            <Search size={21} />
          </button>

          <button className="icon-button">
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
                        <div className="avatar">
                          {post.name[0]}
                        </div>

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
                            fill={
                              liked ? "currentColor" : "none"
                            }
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
                            fill={
                              saved ? "currentColor" : "none"
                            }
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
            <div className="chat-layout">
              <div
                className={`chat-list ${
                  selectedChat ? "mobile-hidden" : ""
                }`}
              >
                <div className="chat-list-header">
                  <div>
                    <h2>Chats</h2>
                    <span>{conversations.length} conversations</span>
                  </div>

                  <button className="icon-button">
                    <Plus size={21} />
                  </button>
                </div>

                <div className="chat-search">
                  <Search size={18} />
                  <input
                    value={searchChat}
                    onChange={(e) =>
                      setSearchChat(e.target.value)
                    }
                    placeholder="Search chats"
                  />
                </div>

                <div className="conversation-list">
                  {filteredChats.map((chat) => (
                    <button
                      className={`conversation ${
                        selectedChat?.id === chat.id
                          ? "selected"
                          : ""
                      }`}
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                    >
                      <div className="chat-avatar">
                        {chat.initials}

                        {chat.online && (
                          <span className="online-dot"></span>
                        )}
                      </div>

                      <div className="conversation-info">
                        <div>
                          <strong>{chat.name}</strong>
                          <small>{chat.time}</small>
                        </div>

                        <div>
                          <p>{chat.lastMessage}</p>

                          {chat.unread > 0 && (
                            <span className="unread">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`chat-window ${
                  !selectedChat ? "no-chat" : ""
                }`}
              >
                {!selectedChat ? (
                  <div className="chat-placeholder">
                    <MessageCircle size={58} />
                    <h2>Your messages</h2>
                    <p>
                      Select a conversation to start chatting.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="chat-header">
                      <button
                        className="back-chat"
                        onClick={() => setSelectedChat(null)}
                      >
                        <ArrowLeft size={21} />
                      </button>

                      <div className="chat-avatar">
                        {selectedChat.initials}

                        {selectedChat.online && (
                          <span className="online-dot"></span>
                        )}
                      </div>

                      <div className="chat-user-info">
                        <strong>{selectedChat.name}</strong>

                        <span>
                          {selectedChat.online
                            ? "Online"
                            : "Offline"}
                        </span>
                      </div>

                      <div className="chat-header-actions">
                        <button>
                          <Phone size={20} />
                        </button>

                        <button>
                          <VideoIcon size={21} />
                        </button>

                        <button>
                          <MoreHorizontal size={21} />
                        </button>
                      </div>
                    </div>

                    <div className="messages-area">
                      <div className="chat-date">
                        TODAY
                      </div>

                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`message-row ${
                            message.sender === "me"
                              ? "mine"
                              : "theirs"
                          }`}
                        >
                          <div className="message-bubble">
                            <p>{message.text}</p>

                            <div className="message-meta">
                              <span>{message.time}</span>

                              {message.sender === "me" && (
                                <CheckCheck size={14} />
                              )}
                            </div>

                            {message.reaction && (
                              <span className="message-reaction">
                                {message.reaction}
                              </span>
                            )}
                          </div>

                          <div className="message-menu">
                            <button
                              onClick={() =>
                                addReaction(
                                  message.id,
                                  "❤️"
                                )
                              }
                            >
                              <Heart size={15} />
                            </button>

                            <button
                              onClick={() =>
                                setReplyingTo(message)
                              }
                            >
                              <Reply size={15} />
                            </button>

                            <button>
                              <Forward size={15} />
                            </button>

                            {message.sender === "me" && (
                              <button
                                onClick={() =>
                                  deleteMessage(message.id)
                                }
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {replyingTo && (
                      <div className="reply-preview">
                        <Reply size={17} />

                        <div>
                          <strong>
                            Replying to{" "}
                            {replyingTo.sender === "me"
                              ? "yourself"
                              : selectedChat.name}
                          </strong>

                          <p>{replyingTo.text}</p>
                        </div>

                        <button
                          onClick={() => setReplyingTo(null)}
                        >
                          ×
                        </button>
                      </div>
                    )}

                    <div className="message-composer">
                      <button>
                        <Paperclip size={21} />
                      </button>

                      <button>
                        <ImageIcon size={21} />
                      </button>

                      <input
                        value={messageText}
                        onChange={(e) =>
                          setMessageText(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            sendMessage();
                          }
                        }}
                        placeholder="Write a message..."
                      />

                      <button>
                        <Smile size={21} />
                      </button>

                      {messageText.trim() ? (
                        <button
                          className="send-button"
                          onClick={sendMessage}
                        >
                          <Send size={19} />
                        </button>
                      ) : (
                        <button>
                          <Mic size={21} />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "status" && (
            <div className="empty-page">
              <CirclePlay size={55} />
              <h2>Status</h2>
              <p>
                Share photos, videos, music and updates.
              </p>

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
              <p>
                Create and join communities around your interests.
              </p>

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
              <p>
                Your latest notifications will appear here.
              </p>
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
              className={
                activeTab === item.id ? "active" : ""
              }
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