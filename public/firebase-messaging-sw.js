importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");

firebase.initializeApp({
  // Project Settings => Add Firebase to your web app
  messagingSenderId: "360108059082",
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {
      return registration.showNotification("my notification title");
    });
  return promiseChain;
});

self.addEventListener("notificationclick", function (event) {
  // do what you want
  // ...
});

// Notification.requestPermission().then((granted) => {
//   if (granted) {
//   }
// });
// const firebaseConfig = {
//   apiKey: "AIzaSyBjWJwgkI8ABEPtmDUxJwzXrwdiQsNX1VM",
//   authDomain: "st-marys-school-d6378.firebaseapp.com",
//   databaseURL: "https://st-marys-school-d6378.firebaseio.com",
//   projectId: "st-marys-school-d6378",
//   storageBucket: "st-marys-school-d6378.appspot.com",
//   messagingSenderId: "360108059082",
//   appId: "1:360108059082:web:8753e636401bce4acac733",
//   measurementId: "G-TGBS4PYXMD",
// };
// firebase.initializeApp(firebaseConfig);

// firebase.messaging();
