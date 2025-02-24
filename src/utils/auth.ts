import { getAuth } from "firebase/auth";

export const getFirebaseToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
};
