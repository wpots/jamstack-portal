import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

const defaultDatabaseUrl =
  'https://goed-gebekt-feedback-default-rtdb.europe-west1.firebasedatabase.app/';

function readRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = readRequiredEnv('FIREBASE_PROJECT_ID');
  const clientEmail = readRequiredEnv('FIREBASE_CLIENT_EMAIL');
  const privateKey = readRequiredEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');
  const databaseURL = process.env.FIREBASE_DATABASE_URL || defaultDatabaseUrl;

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    databaseURL,
  });
}

export const adminDatabase = getDatabase(getFirebaseAdminApp());
