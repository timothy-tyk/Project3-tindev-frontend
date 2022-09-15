// Import the functions you need from the SDKs you need
import { initializeApp, getStorage } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNAFM8xFmrFMt8OOm7gzrJI--XbSlS_bY",
  authDomain: "tindev-f1fdd.firebaseapp.com",
  projectId: "tindev-f1fdd",
  storageBucket: "tindev-f1fdd.appspot.com",
  messagingSenderId: "134057737134",
  appId: "1:134057737134:web:3775df62b3c0417f1fa63f",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const storage = getStorage(firebaseApp);
