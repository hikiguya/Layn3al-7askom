import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVM1bXz1fl4uEgnz-6MYETXKoFK8JIrVA",
  authDomain: "layn3al-7askom.firebaseapp.com",
  projectId: "layn3al-7askom",
  storageBucket: "layn3al-7askom.firebasestorage.app",
  messagingSenderId: "201113072196",
  appId: "1:201113072196:web:73b692831b5ee2607e4211"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);