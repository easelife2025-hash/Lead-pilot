import { initializeApp, getApps } from 'firebase/app';
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

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
