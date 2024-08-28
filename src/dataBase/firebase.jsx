import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD2qT1SvHYr7Y9Mfnbegb5jW28s3VqMiFU",
  authDomain: "dbtesis-2fe55.firebaseapp.com",
  projectId: "dbtesis-2fe55",
  storageBucket: "dbtesis-2fe55.appspot.com",
  messagingSenderId: "499310183533",
  appId: "1:499310183533:web:9634f3b46530249f832b64",
  measurementId: "G-MHSXLM2Q4K",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
