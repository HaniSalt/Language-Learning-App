// server/context.ts
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK (do this once)
// Ensure GOOGLE_APPLICATION_CREDENTIALS is set in your environment
// or initialize with credentials object:
// import serviceAccount from './path/to/your/serviceAccountKey.json';
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
if (!admin.apps.length) {
    admin.initializeApp(); // Reads from GOOGLE_APPLICATION_CREDENTIALS by default
}

interface UserContext {
  uid: string;
  email?: string;
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v10/context
 */
export async function createContext({ req, res }: CreateExpressContextOptions, getDb: () => any) {
  // For auth purposes, you might grab a token from headers
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    const idToken = authorizationHeader.split('Bearer ')[1];
    try {
      const decodedToken: DecodedIdToken = await admin.auth().verifyIdToken(idToken);
      return {
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
        } as UserContext,
        req,
        res,
      };
    } catch (error) {
      console.error('Invalid Firebase ID token:', error);
      // Don't throw here, let procedures decide if auth is required
    }
  }
  return { user: null as UserContext | null, req, res };
}

export type Context = Awaited<ReturnType<typeof createContext>>;