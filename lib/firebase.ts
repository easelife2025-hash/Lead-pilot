import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBK9N0TSiQwOw7x7fg8Mqi0s9yvp4ZzoZo",
  authDomain: "lead-pilot-24862.firebaseapp.com",
  projectId: "lead-pilot-24862",
  storageBucket: "lead-pilot-24862.firebasestorage.app",
  messagingSenderId: "755832745258",
  appId: "1:755832745258:web:91a463564781bdd0c94253"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Safe initialization of auth for Next.js SSR
let auth: any = null;
if (typeof window !== 'undefined') {
  auth = getAuth(app);
}

export { app, db, auth };

