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

// debugging code for getting token so I can check userId with postman
// const user = auth.currentUser;
// if (user) {
//   user.getIdToken().then(token => console.log(token));
// }


export { auth };
// export const doSendEmailVerification = async () => {
//     return auth.currentUser.sendEmailVerification()
// }