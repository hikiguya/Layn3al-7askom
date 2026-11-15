import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:REACT_APP_FIREBASE_API_KEY
  authDomain: 
  projectId: 
  storageBucket:
  messagingSenderId:
  appId:
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
