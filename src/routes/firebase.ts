import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4thgw2EGKJIgXkvevcvtzayrUQrDZQvY",
  authDomain: "twitter-clone-2e2e7.firebaseapp.com",
  projectId: "twitter-clone-2e2e7",
  storageBucket: "twitter-clone-2e2e7.appspot.com",
  messagingSenderId: "579295206856",
  appId: "1:579295206856:web:adeb8a430234b1a4afb4fd",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
