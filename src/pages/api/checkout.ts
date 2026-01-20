import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Initialize Stripe (conditional to prevent build errors if key is missing)
const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-12-15.clover' })
    : null;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        // Fallback for Development if no keys set
        if (!stripe) {
            console.error('Stripe Secret Key is missing.');
            return res.status(500).json({
                error: 'Stripe is not configured. Missing STRIPE_SECRET_KEY in environment variables.'
            });
        }

        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        const origin = `${protocol}://${host}`;

        const { amount, description, userId } = req.body;

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'TRB Alchemy™️ Professional Profile',
                            description: description || 'Comprehensive Psychometric Assessment',
                            images: ['https://trbalchemy.com/assets/report-preview.png'],
                        },
                        unit_amount: amount || 4900, // Default to $49 if not sent
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/assessment?session_id={CHECKOUT_SESSION_ID}&payment_success=true`,
            cancel_url: `${origin}/onboarding?payment_canceled=true`,
            metadata: {
                source: 'web_app_v1',
                userId: req.body.userId // Vital for webhook to ID the user
            }
        });

        res.status(200).json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Checkout Error:', err);
        res.status(500).json({ statusCode: 500, message: err.message });
    }
}
