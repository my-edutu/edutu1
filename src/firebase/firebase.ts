// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBo1I-yAYmCM8Rw_csMMOl_Y6PlGbdRxkw",
  authDomain: "edutu-d4a5e.firebaseapp.com",
  projectId: "edutu-d4a5e",
  storageBucket: "edutu-d4a5e.appspot.com",
  messagingSenderId: "351947047932",
  appId: "1:351947047932:web:e67afaea8d0d9cd2e06879",
  measurementId: "G-HR7N19BH02"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };