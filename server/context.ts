import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

if (!admin.apps.length) {
    admin.initializeApp();
}

interface UserContext {
  uid: string;
  email?: string;
}

export async function createContext({ req, res }: CreateExpressContextOptions, getDb: () => any) {
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
    }
  }
  return { user: null as UserContext | null, req, res };
}

export type Context = Awaited<ReturnType<typeof createContext>>;