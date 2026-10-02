import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoYr7uwBd6FHaEg5lqp1JwHdtrwdobJXo",
  authDomain: "wearwise-a9a43.firebaseapp.com",
  projectId: "wearwise-a9a43",
  storageBucket: "wearwise-a9a43.firebasestorage.app",
  messagingSenderId: "92587627735",
  appId: "1:92587627735:web:b6f402f01caef4929ecc92",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;