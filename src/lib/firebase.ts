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
// Initialize only if not already initialized
let app: any; // Explicitly type as any to handle the conditional initialization cleanly without complex type guards for this fallback file
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
// Return null if app is not initialized so consumers can safely check for existence
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported && app) {
            analytics = getAnalytics(app);
        }
    });
}

export { analytics };
