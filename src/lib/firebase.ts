import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA7kIivXXggZZH4HvG-4TU06POySNEFSYM",
  authDomain: "wastewise-analytics-1z9zt.firebaseapp.com",
  projectId: "wastewise-analytics-1z9zt",
  storageBucket: "wastewise-analytics-1z9zt.firebasestorage.app",
  messagingSenderId: "508279724489",
  appId: "1:508279724489:web:ba8f705beabb3ebdab3018"
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
