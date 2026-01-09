import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyD4GoPva_dNnCaj4kZfCGLlorYi8pF3BVI",
    authDomain: "psychometric-1cd63.firebaseapp.com",
    projectId: "psychometric-1cd63",
    storageBucket: "psychometric-1cd63.firebasestorage.app",
    messagingSenderId: "778437806706",
    appId: "1:778437806706:web:25f3ffd367e56cb26990eb",
    measurementId: "G-KKXZC1LT4G"
};

// Initialize only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { analytics };
