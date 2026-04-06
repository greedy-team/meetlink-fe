import { initializeApp } from 'firebase/app';
import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  type Messaging,
  onMessage,
} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingFirebaseKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (import.meta.env.DEV && missingFirebaseKeys.length > 0) {
  console.error('Firebase config 누락:', missingFirebaseKeys);
}

const app = initializeApp(firebaseConfig);

let messagingPromise: Promise<Messaging | null> | null = null;

const getMessagingSafely = async (): Promise<Messaging | null> => {
  if (!messagingPromise) {
    messagingPromise = (async () => {
      const supported = await isSupported().catch(() => false);
      if (!supported) return null;
      return getMessaging(app);
    })();
  }

  return messagingPromise;
};

export const requestPushPermission = async () => {
  try {
    const messaging = await getMessagingSafely();
    if (!messaging) return null;

    if (typeof Notification === 'undefined') return null;

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.warn('푸시 알림 권한이 거부되었습니다');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    return token;
  } catch (error) {
    console.error('푸시 권한 요청 중 에러 발생:', error);
    return null;
  }
};

export const deletePushPermission = async () => {
  try {
    const messaging = await getMessagingSafely();
    if (!messaging) return false;

    const isDeleted = await deleteToken(messaging);
    return isDeleted;
  } catch (error) {
    console.error('토큰 삭제 실패:', error);
    return false;
  }
};

export const subscribeForegroundMessage = async () => {
  const messaging = await getMessagingSafely();
  if (!messaging) return () => {};

  if (typeof Notification === 'undefined') return () => {};

  return onMessage(messaging, (payload) => {
    const title = payload.notification?.title ?? 'MeetLink';
    const body = payload.notification?.body ?? '';

    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/logo2.svg',
      });
    }
  });
};
