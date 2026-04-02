import { initializeApp } from 'firebase/app';
import { deleteToken, getMessaging, getToken, onMessage } from 'firebase/messaging';

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
export const messaging = getMessaging(app);

export const requestPushPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      return token;
    } else {
      console.warn('푸시 알림 권한이 거부되었습니다');
      return null;
    }
  } catch (error) {
    console.error('푸시 권한 요청 중 에러 발생:', error);
    return null;
  }
};

export const deletePushPermission = async () => {
  try {
    if (!messaging) return false;
    const isDeleted = await deleteToken(messaging);
    return isDeleted;
  } catch (error) {
    console.error('토큰 삭제 실패:', error);
    return false;
  }
};

export const subscribeForegroundMessage = () => {
  return onMessage(messaging, (payload) => {
    const title = payload.notification?.title ?? 'MeetLink';
    const body = payload.notification?.body ?? '';

    new Notification(title, {
      body,
      icon: '/logo2.svg',
    });
  });
};
