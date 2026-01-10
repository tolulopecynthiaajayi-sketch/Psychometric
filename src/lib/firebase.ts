import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize only if not already initialized
let app;
if (getApps().length === 0) {
    if (!firebaseConfig.apiKey) {
        console.warn('⚠️ Firebase API keys missing. Authentication and Database will not work.');
        // Prevent crash during build/CI where secrets might be missing
        // This allows the build to finish, though usage will fail at runtime.
    } else {
        app = initializeApp(firebaseConfig);
    }
} else {
    app = getApps()[0];
}

// Export auth/db but handle potential undefined app (though getAuth might internally throw if app is undefined)
// We cast app to any to bypass strict type check for the fallback scenario, 
// ensuring we don't break the build just because of missing keys.
export const auth = app ? getAuth(app) : {} as any;
export const db = app ? getFirestore(app) : {} as any;

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
