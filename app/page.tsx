"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Heart, LogOut, MessageCircle, Phone, Send, UserPlus, Users, Video } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { resetPassword } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ForgotPassword from "@/components/auth/ForgotPassword";
import { chatIdFor, createPost, ensureProfile, followUser, Profile, Post, sendMessage, subscribeFollowing, subscribeMessages, subscribePosts, subscribeUsers, toggleLike, ChatMessage } from "@/lib/firestore";

type Screen = "login" | "signup" | "forgot" | "home";
type Tab = "feed" | "messages" | "people" | "profile" | "calls";

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("login");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("feed");
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [postText, setPostText] = useState("");
  const [selectedChatUser, setSelectedChatUser] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => onAuthStateChanged(auth, async (firebaseUser) => {
    setUser(firebaseUser);
    if (!firebaseUser) { setScreen("login"); setProfile(null); setLoading(false); return; }
    try {
      await ensureProfile(firebaseUser);
      const snap = await getDoc(doc(db, "users", firebaseUser.uid));
      if (snap.exists()) setProfile({ id: snap.id, ...(snap.data() as Omit<Profile, "id">) });
      setScreen("home");
    } catch (error) { console.error(error); }
    setLoading(false);
  }), []);

  useEffect(() => {
    if (!user) return;
    const unPosts = subscribePosts(setPosts);
    const unUsers = subscribeUsers(setUsers);
    const unFollowing = subscribeFollowing(user.uid, setFollowing);
    return () => { unPosts(); unUsers(); unFollowing(); };
  }, [user]);

  useEffect(() => {
    if (!selectedChatUser || !user) { setMessages([]); return; }
    return subscribeMessages(chatIdFor(user.uid, selectedChatUser.id), setMessages);
  }, [selectedChatUser, user]);

  const otherUsers = useMemo(() => users.filter((u) => u.id !== user?.uid), [users, user]);

  async function publish() {
    if (!profile || !postText.trim()) return;
    setBusy(true);
    try { await createPost(profile, postText); setPostText(""); } finally { setBusy(false); }
  }

  async function toggleFollow(target: Profile) {
    if (!user) return;
    const isFollowing = following.has(target.id);
    setBusy(true);
    try { await followUser(user.uid, target.id, isFollowing); } finally { setBusy(false); }
  }

  async function like(post: Post) {
    if (!user) return;
    const isLiked = liked.has(post.id);
    setLiked((current) => { const next = new Set(current); isLiked ? next.delete(post.id) : next.add(post.id); return next; });
    try { await toggleLike(post.id, user.uid, isLiked); } catch { setLiked((current) => { const next = new Set(current); isLiked ? next.add(post.id) : next.delete(post.id); return next; }); }
  }

  async function sendChat() {
    if (!user || !selectedChatUser || !messageText.trim()) return;
    const chatId = chatIdFor(user.uid, selectedChatUser.id);
    const text = messageText;
    setMessageText("");
    await sendMessage(chatId, user.uid, text, [user.uid, selectedChatUser.id]);
  }

  async function logout() { await firebaseSignOut(auth); setScreen("login"); }

  if (loading) return <main className="auth-page"><div className="auth-card"><h1>Social freeText</h1><p className="auth-subtitle">Connecting to the live service…</p></div></main>;
  if (screen === "login") return <main className="auth-page"><LoginForm onSuccess={() => setScreen("home")} onForgotPassword={() => setScreen("forgot")} onCreateAccount={() => setScreen("signup")} /></main>;
  if (screen === "signup") return <main className="auth-page"><SignupForm onSuccess={() => setScreen("home")} onLogin={() => setScreen("login")} /></main>;
  if (screen === "forgot") return <main className="auth-page"><ForgotPassword onBack={() => setScreen("login")} /></main>;

  return (
    <main className="app-shell">
      <header className="top-header">
        <div className="brand-mini"><div className="brand-mini-logo">SF</div><div><strong>Social freeText</strong><span>Live social platform</span></div></div>
        <div className="header-actions"><button className="action-button" onClick={logout} title="Log out"><LogOut size={18}/></button><button className="mini-profile">{profile?.displayName?.[0]?.toUpperCase() || "U"}</button></div>
      </header>
      <section className="main-content">
        <div className="page-heading"><div><h1>Welcome, {profile?.displayName || "friend"} 👋</h1><p>Real accounts, realtime posts and realtime messages.</p></div></div>
        <nav className="nav-tabs">
          {(["feed","messages","people","profile","calls"] as Tab[]).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item === "feed" ? "Home" : item === "messages" ? "Messages" : item === "people" ? "People" : item === "profile" ? "Profile" : "Calls"}</button>)}
        </nav>

        {tab === "feed" && <div className="grid"><div>
          <div className="card composer"><textarea value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="What's happening? Share something with real people…"/><button className="primary-button" disabled={busy || !postText.trim()} onClick={publish}><Send size={18}/> Publish</button></div>
          {posts.map((post) => <article className="card" key={post.id}><div className="row"><div className="avatar">{post.authorName?.[0]?.toUpperCase() || "U"}</div><div><strong>{post.authorName}</strong><div className="muted">@{post.authorUsername || "user"}</div></div></div><div className="post-text">{post.text}</div><div className="actions"><button className={`action-button ${liked.has(post.id) ? "liked" : ""}`} onClick={() => like(post)}><Heart size={16} fill={liked.has(post.id) ? "currentColor" : "none"}/> {post.likesCount || 0}</button><button className="action-button" onClick={() => { const author = users.find((u) => u.id === post.authorId); if (author) { setSelectedChatUser(author); setTab("messages"); } }}><MessageCircle size={16}/> Message</button></div></article>)}
          {!posts.length && <div className="card empty">No posts yet. Be the first person to publish.</div>}
        </div><aside><div className="card"><h3>People to connect with</h3>{otherUsers.slice(0,8).map((person) => <div className="user-row" key={person.id}><div className="row"><div className="avatar">{person.displayName?.[0]?.toUpperCase() || "U"}</div><div><strong>{person.displayName}</strong><div className="muted">@{person.username}</div></div></div><button className="action-button" onClick={() => toggleFollow(person)}>{following.has(person.id) ? "Following" : <UserPlus size={16}/>}</button></div>)}</div></aside></div>}

        {tab === "people" && <div className="card"><h2>People</h2>{otherUsers.map((person) => <div className="user-row" key={person.id}><div className="row"><div className="avatar">{person.displayName?.[0]?.toUpperCase() || "U"}</div><div><strong>{person.displayName}</strong><div className="muted">@{person.username} · {person.followersCount || 0} followers</div></div></div><div className="actions"><button className="action-button" onClick={() => toggleFollow(person)}>{following.has(person.id) ? "Following" : "Follow"}</button><button className="action-button" onClick={() => { setSelectedChatUser(person); setTab("messages"); }}><MessageCircle size={16}/></button></div></div>)}{!otherUsers.length && <div className="empty">When other people create accounts, they will appear here.</div>}</div>}

        {tab === "messages" && <div className="card chat-layout"><div className="chat-list"><h3>Messages</h3>{otherUsers.map((person) => <button key={person.id} className="user-row" style={{width:"100%",background:selectedChatUser?.id===person.id?"#eff6ff":"transparent",border:0}} onClick={() => setSelectedChatUser(person)}><div className="row"><div className="avatar">{person.displayName?.[0]?.toUpperCase() || "U"}</div><strong>{person.displayName}</strong></div></button>)}</div><div className="chat-window">{selectedChatUser ? <><div className="row"><div className="avatar">{selectedChatUser.displayName?.[0]?.toUpperCase() || "U"}</div><div><strong>{selectedChatUser.displayName}</strong><div className="muted">@{selectedChatUser.username}</div></div></div><div className="messages">{messages.map((m) => <div key={m.id} className={`bubble ${m.senderId===user?.uid?"mine":""}`}>{m.text}</div>)}{!messages.length && <div className="empty">Start a realtime conversation.</div>}</div><div className="chat-compose"><input value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={(e) => {if(e.key==="Enter") void sendChat();}} placeholder="Write a message…"/><button className="primary-button" style={{width:"auto",marginTop:0}} onClick={sendChat}><Send size={18}/></button></div></> : <div className="empty">Choose a person to start messaging.</div>}</div></div>}

        {tab === "profile" && <div className="card"><div className="profile-head"><div className="avatar large">{profile?.displayName?.[0]?.toUpperCase() || "U"}</div><div><h2>{profile?.displayName}</h2><div className="muted">@{profile?.username}</div><p>{profile?.bio || "Welcome to Social freeText."}</p></div></div><div className="row" style={{marginTop:20}}><strong>{profile?.followersCount || 0} followers</strong><strong>{profile?.followingCount || 0} following</strong></div></div>}

        {tab === "calls" && <div className="card"><h2>Voice & video calls</h2><p className="muted">Call controls are connected to the live-user directory. Select a person below to start the call interface.</p>{otherUsers.map((person) => <div className="user-row" key={person.id}><div className="row"><div className="avatar">{person.displayName?.[0]?.toUpperCase() || "U"}</div><strong>{person.displayName}</strong></div><div className="actions"><button className="action-button" onClick={() => alert(`Voice call with ${person.displayName} is ready for WebRTC signaling.`)}><Phone size={16}/></button><button className="action-button" onClick={() => alert(`Video call with ${person.displayName} is ready for WebRTC signaling.`)}><Video size={16}/></button></div></div>)}</div>}
      </section>
    </main>
  );
}
