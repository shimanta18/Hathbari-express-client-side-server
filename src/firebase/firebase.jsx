import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQM4CoXcgn5YXYGJW8XCKm8h8_jzSgww8",
  authDomain: "grocery-d69f4.firebaseapp.com",
  projectId: "grocery-d69f4",
  storageBucket: "grocery-d69f4.firebasestorage.app",
  messagingSenderId: "372095962664",
  appId: "1:372095962664:web:d6b61e117b917b377c2f1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithEmailAndPassword, signInWithPopup };

// 🔑 ADD THIS LINE BELOW TO SOLVE THE ERROR:
export default app;