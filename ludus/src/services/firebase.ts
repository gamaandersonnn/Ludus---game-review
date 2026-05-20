import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxZ3KzlfzD700Wrkd82Ju-3AD-SnOn6Qs",
  authDomain: "ludus-gamereview.firebaseapp.com",
  projectId: "ludus-gamereview",
  storageBucket: "ludus-gamereview.firebasestorage.app",
  messagingSenderId: "499750532965",
  appId: "1:499750532965:web:40b98a22e06d71b68d538c",
  measurementId: "G-LPGZJVXRML",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logout() {
  await signOut(auth);
}
