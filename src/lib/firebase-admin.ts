import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getMessaging, type Messaging } from "firebase-admin/messaging";

function getServiceAccount() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin env vars. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY."
    );
  }

  return { 
    projectId, 
    clientEmail, 
    privateKey 
  };
}

// Force Google Cloud SDKs to use this project ID
process.env.GOOGLE_CLOUD_PROJECT = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim() || "bookverse-e7e3f";

let _app: App | undefined;
let _auth: Auth | undefined;

function getFirebaseAdminApp(): App {
  if (!_app) {
    // If the app is already initialized by Next.js hot-reloading, reuse it
    const existingApp = getApps().find(app => app.name === 'BookVerseApp');
    if (existingApp) {
      _app = existingApp;
    } else {
      _app = initializeApp({
        credential: cert(getServiceAccount()),
        projectId: getServiceAccount().projectId,
      }, 'BookVerseApp');
    }
  }
  return _app;
}

function getAdminAuth(): Auth {
  if (!_auth) {
    _auth = getAuth(getFirebaseAdminApp());
  }
  return _auth;
}

export { getFirebaseAdminApp as firebaseAdminApp };
export const adminAuth = new Proxy({} as Auth, {
  get(_target, prop, receiver) {
    return Reflect.get(getAdminAuth(), prop, receiver);
  },
});

function getAdminMessaging(): Messaging {
  return getMessaging(getFirebaseAdminApp());
}

export const adminMessaging = new Proxy({} as Messaging, {
  get(_target, prop, receiver) {
    return Reflect.get(getAdminMessaging(), prop, receiver);
  },
});

