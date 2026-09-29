import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVHkpIkEfz_JZxWUUhwlzEDcItnjBqwbM",
  authDomain: "studio-496646166-6ddbb.firebaseapp.com",
  projectId: "studio-496646166-6ddbb",
  storageBucket: "studio-496646166-6ddbb.firebasestorage.app",
  messagingSenderId: "891342107077",
  appId: "1:891342107077:web:0cebab0102c21aff671bac",
};

const app = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;