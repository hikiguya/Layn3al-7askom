import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:REACT_APP_FIREBASE_API_KEY
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN
  projectId: REACT_APP_FIREBASE_PROJECT_ID
  storageBucket:
  messagingSenderId:
  appId:
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
