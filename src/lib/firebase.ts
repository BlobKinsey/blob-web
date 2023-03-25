import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCTpWTavbf39SneDt7wPnSKZyDGqvtHt7A",
  authDomain: "blob-kinsey.firebaseapp.com",
  projectId: "blob-kinsey",
  storageBucket: "blob-kinsey.appspot.com",
  messagingSenderId: "897979568508",
  appId: "1:897979568508:web:2dbced4a9de9415db154f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

