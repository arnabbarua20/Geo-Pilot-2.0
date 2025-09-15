import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Simple configuration - will work with defaults if keys aren't provided
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: `drone-zones-demo.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "drone-zones-demo",
  storageBucket: `drone-zones-demo.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

let app: any = null;
let auth: any = null;
let db: any = null;
let googleProvider: any = null;

// Only initialize Firebase if we have real API keys
const hasValidConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                       import.meta.env.VITE_FIREBASE_PROJECT_ID && 
                       import.meta.env.VITE_FIREBASE_APP_ID;

if (hasValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
}

export { db, auth, googleProvider };
export default app;
