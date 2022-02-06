import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgvNXhzpjAajlhjJEiIE7fcTiVDYogBSk",
  authDomain: "tcr-hs00001.firebaseapp.com",
  projectId: "tcr-hs00001",
  storageBucket: "tcr-hs00001.appspot.com",
  messagingSenderId: "73972415795",
  appId: "1:73972415795:web:30fdfeea5ee15c1e53d246"
};

// Initialize FireBase (The application)
const app = initializeApp(firebaseConfig);

// Initialize FireStore (The database)
const db= getFirestore(app);

// Export the DB
export default db;