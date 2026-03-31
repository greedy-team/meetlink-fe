importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCO1NPyTUETI-tnqMCsnqCF2J7alNdw79k',
  authDomain: 'meetlink-2acf1.firebaseapp.com',
  projectId: 'meetlink-2acf1',
  storageBucket: 'meetlink-2acf1.firebasestorage.app',
  messagingSenderId: '673444157380',
  appId: '1:673444157380:web:b0f1b543fde583fa1f7691',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('백그라운드 메시지 수신:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo2.svg',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
