import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBgrCccmCYUXyXvbFhaF5NocfnuWC_LCa4",
  authDomain: "aura-84170.firebaseapp.com",
  projectId: "aura-84170",
  storageBucket: "aura-84170.firebasestorage.app",
  messagingSenderId: "441749708484",
  appId: "1:441749708484:web:b51de98ed7e32f67acf391"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
