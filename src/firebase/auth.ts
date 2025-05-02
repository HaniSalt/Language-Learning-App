import { auth } from "./firebase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updatePassword } from "firebase/auth";

export const docreateUserWithEmailAndPassword = async (email, password) => {    
    return createUserWithEmailAndPassword(auth, email, password)
}

export const doSignInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const doSignOut = async () => {
    return auth.signOut()
}

export const doPasswordReset = async (email) => {
    return sendPasswordResetEmail(auth,email)
}

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password)
}

// export const doSendEmailVerification = async () => {
//     return auth.currentUser.sendEmailVerification()
// }