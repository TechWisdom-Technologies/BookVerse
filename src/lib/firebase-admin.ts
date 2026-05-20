import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

function getServiceAccount() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin env vars. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY."
    );
  }

  return { projectId, clientEmail, privateKey };
}

let _app: App | undefined;
let _auth: Auth | undefined;

function getFirebaseAdminApp(): App {
  if (!_app) {
    _app =
      getApps().length === 0
        ? initializeApp({ credential: cert(getServiceAccount()) })
        : getApps()[0]!;
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

