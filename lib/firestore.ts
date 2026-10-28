import { db } from "@/lib/firebase";
import { addDoc, collection, doc, getDoc, increment, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, limit } from "firebase/firestore";

export type Profile = { id: string; displayName: string; username: string; email?: string; bio?: string; followersCount?: number; followingCount?: number };
export type Post = { id: string; authorId: string; authorName: string; authorUsername?: string; text: string; likesCount?: number; createdAt?: unknown };
export type ChatMessage = { id: string; senderId: string; text: string; createdAt?: unknown };

export async function ensureProfile(user: { uid: string; displayName?: string | null; email?: string | null }) {
  const ref = doc(db, "users", user.uid);
  const existing = await getDoc(ref);
  if (!existing.exists()) {
    await setDoc(ref, {
      displayName: user.displayName || "New user",
      username: (user.displayName || "user").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24) || `user_${user.uid.slice(0, 6)}`,
      email: user.email || "",
      bio: "",
      followersCount: 0,
      followingCount: 0,
      createdAt: serverTimestamp(),
    });
  }
}

export function subscribeUsers(callback: (users: Profile[]) => void) {
  return onSnapshot(query(collection(db, "users"), limit(50)), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Profile, "id">) })));
  });
}

export async function createPost(user: Profile, text: string) {
  const clean = text.trim();
  if (!clean) return;
  await addDoc(collection(db, "posts"), {
    authorId: user.id,
    authorName: user.displayName,
    authorUsername: user.username,
    text: clean,
    likesCount: 0,
    createdAt: serverTimestamp(),
  });
}

export function subscribePosts(callback: (posts: Post[]) => void) {
  return onSnapshot(query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50)), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Post, "id">) })));
  });
}

export async function toggleLike(postId: string, uid: string, liked: boolean) {
  const likeRef = doc(db, "posts", postId, "likes", uid);
  if (liked) {
    await updateDoc(doc(db, "posts", postId), { likesCount: increment(-1) });
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(likeRef);
  } else {
    await setDoc(likeRef, { uid, createdAt: serverTimestamp() });
    await updateDoc(doc(db, "posts", postId), { likesCount: increment(1) });
  }
}

export async function followUser(followerId: string, followingId: string, following: boolean) {
  const id = `${followerId}_${followingId}`;
  const ref = doc(db, "follows", id);
  if (following) {
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(ref);
    await updateDoc(doc(db, "users", followerId), { followingCount: increment(-1) });
    await updateDoc(doc(db, "users", followingId), { followersCount: increment(-1) });
  } else {
    await setDoc(ref, { followerId, followingId, createdAt: serverTimestamp() });
    await updateDoc(doc(db, "users", followerId), { followingCount: increment(1) });
    await updateDoc(doc(db, "users", followingId), { followersCount: increment(1) });
  }
}

export function subscribeFollowing(followerId: string, callback: (ids: Set<string>) => void) {
  return onSnapshot(query(collection(db, "follows"), where("followerId", "==", followerId)), (snap) => {
    callback(new Set(snap.docs.map((d) => String(d.data().followingId))));
  });
}

export function chatIdFor(a: string, b: string) { return [a, b].sort().join("_"); }

export async function sendMessage(chatId: string, senderId: string, text: string, participants: string[]) {
  const clean = text.trim();
  if (!clean) return;
  await setDoc(doc(db, "chats", chatId), { participants, lastMessage: clean, updatedAt: serverTimestamp() }, { merge: true });
  await addDoc(collection(db, "chats", chatId, "messages"), { senderId, text: clean, createdAt: serverTimestamp() });
}

export function subscribeMessages(chatId: string, callback: (messages: ChatMessage[]) => void) {
  return onSnapshot(query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"), limit(200)), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ChatMessage, "id">) })));
  });
}
