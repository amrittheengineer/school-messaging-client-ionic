import * as firebaseApp from "firebase/app";
import "firebase/storage";
import "firebase/messaging";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjWJwgkI8ABEPtmDUxJwzXrwdiQsNX1VM",
  authDomain: "st-marys-school-d6378.firebaseapp.com",
  databaseURL: "https://st-marys-school-d6378.firebaseio.com",
  projectId: "st-marys-school-d6378",
  storageBucket: "st-marys-school-d6378.appspot.com",
  messagingSenderId: "360108059082",
  appId: "1:360108059082:web:8753e636401bce4acac733",
  measurementId: "G-TGBS4PYXMD",
};

export const app = firebaseApp.initializeApp(firebaseConfig);
export const storage = app.storage();
export const auth = app.auth();
export const firebase = firebaseApp;
let messagingRef;
try {
  messagingRef = app.messaging();
  // messagingRef
  //   .getToken()
  //   .then((token) => {
  //     alert(token);
  //   })
  //   .catch((err) => {
  //     alert("No token " + err);
  //   });
} catch (error) {}
export const messaging = messagingRef;
