import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";

import configs from "./configs";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
// import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  // apiKey: "AIzaSyA52_bDKWqFIFTuC_w457rHViKARk-0rho",
  // authDomain: "meetpoint-me.firebaseapp.com",
  // projectId: "meetpoint-me",
  // storageBucket: "meetpoint-me.appspot.com",
  // messagingSenderId: "873569654932",
  // appId: "1:873569654932:web:aa17fc0950b4bb74337c81",
  // measurementId: "G-YGJ204FN2H",


  apiKey: "AIzaSyA52_bDKWqFIFTuC_w457rHViKARk-0rho",
  authDomain: "meetpoint-me.firebaseapp.com",
  databaseURL: "https://meetpoint-me-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "meetpoint-me",
  storageBucket: "meetpoint-me.appspot.com",
  messagingSenderId: "873569654932",
  appId: "1:873569654932:web:aa17fc0950b4bb74337c81",
  measurementId: "G-YGJ204FN2H"

  // apiKey: "AIzaSyAbKSD1avS1zIy5pItJwbwN6JZMw1FBTmc",
  // authDomain: "duck-gym-demo.firebaseapp.com",
  // projectId: "duck-gym-demo",
  // storageBucket: "duck-gym-demo.appspot.com",
  // messagingSenderId: "922465706217",
  // appId: "1:922465706217:web:f6bcde5bc67fa3add75078"
};
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
// export const analytics = getAnalytics(firebaseApp);

// logEvent(analytics, "notification_received");

enableIndexedDbPersistence(db, { forceOwnership: false });
