importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyD2qT1SvHYr7Y9Mfnbegb5jW28s3VqMiFU",
  authDomain: "dbtesis-2fe55.firebaseapp.com",
  projectId: "dbtesis-2fe55",
  storageBucket: "dbtesis-2fe55.appspot.com",
  messagingSenderId: "499310183533",
  appId: "1:499310183533:web:9634f3b46530249f832b64",
  measurementId: "G-MHSXLM2Q4K",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/LogoSinFondo.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
