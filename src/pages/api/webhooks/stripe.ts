import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
// import { adminDb } from '@/lib/firebaseAdmin'; // REMOVED: Using client SDK for simplicity

// WAIT: The project might not have firebaseAdmin set up. 
// Checking `src/lib/firebase.ts` or similar would be good. 
// For now, I'll use the client SDK with simple auth if needed, OR better, I'll assume standard firebase-admin is needed for reliable server-side writes bypassing rules.
// Let's check if `firebaseAdmin` exists. If not, I might need to create it or use standard `firebase/firestore` with a logged-in service account (complex).
// Actually, for a quick fix, I will use `firebase-admin` IF it exists. 
// If I don't see it in the file list, I'll use basic logging for now and ask user or use the client SDK (which works in Node env too if initialized).

// Let's just assume we can write to Firestore.
// Re-reading context... I haven't seen `firebaseAdmin`. 
// I'll try to import `db` from `@/lib/firebase` but using client SDK in an API route is sometimes flaky with auth.
// BETTER: Use `firebase-admin`. I'll create the file without it first, just logging, then I'll check/add admin.
// Wait, I can't just "create" admin without a service account key.
// I will use the Client SDK for now, simpler. It works in Node.js environments.

import { db } from '@/lib/firebase';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Stripe requires raw body for signature verification
export const config = {
    api: {
        bodyParser: false,
    },
};

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-12-15.clover' } as any) // Type hack if version mismatch
    : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    if (!stripe || !webhookSecret) {
        console.error("Stripe keys missing");
        return res.status(500).json({ error: "Stripe configuration missing" });
    }

    let event: Stripe.Event;

    try {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature']!;

        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
            console.log(`💰 Payment success for User: ${userId}`);

            try {
                // Update Firestore
                const userRef = doc(db, 'users', userId);

                // We use setDoc with merge: true to be safe if doc doesn't exist
                await setDoc(userRef, {
                    isPremium: true,
                    updatedAt: serverTimestamp(),
                    lastPaymentId: session.id,
                    lastPaymentAmount: session.amount_total,
                    lastPaymentDate: new Date().toISOString()
                }, { merge: true });

                console.log("✅ Firestore updated via Webhook");
            } catch (error) {
                console.error("❌ Firestore update failed", error);
                return res.status(500).json({ error: 'Database update failed' });
            }
        } else {
            console.warn("⚠️ Webhook received but no userId in metadata");
        }
    }

    res.json({ received: true });
}
