
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyAlWQOEnGlvh6mMd5XdUlQYzW_6CAMp5Cs",
  authDomain: "flatsapp-28f34.firebaseapp.com",
  projectId: "flatsapp-28f34",
  storageBucket: "flatsapp-28f34.appspot.com",
  messagingSenderId: "470642266119",
  appId: "1:470642266119:web:3a0214494812dd3c2a9aa2",
  measurementId: "G-KR6CL3BPQ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }