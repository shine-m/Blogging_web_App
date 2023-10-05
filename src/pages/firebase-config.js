import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdmqiMzxOHHKbPmm0z-JrjPDKg_QGbPFs",
  authDomain: "blog-project-3100.firebaseapp.com",
  projectId: "blog-project-3100",
  storageBucket: "blog-project-3100.appspot.com",
  messagingSenderId: "674522460450",
  appId: "1:674522460450:web:ba5f036334436be1caf57b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const storage = getStorage(app);
