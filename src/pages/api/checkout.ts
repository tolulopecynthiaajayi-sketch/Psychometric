import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Initialize Stripe (conditional to prevent build errors if key is missing)
const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
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
            console.warn('⚠️ Stripe API keys not missing. Using mock checkout flow.');
            return res.status(200).json({
                url: '/results?payment_success=true', // Redirect directly to manual success
                mock: true
            });
        }

        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        const origin = `${protocol}://${host}`;

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'TRB Alchemy™️ Full Profile',
                            description: 'Comprehensive 6-Dimension Psychometric Assessment & Detailed PDF Report',
                            images: ['https://trbalchemy.com/assets/report-preview.png'], // Placeholder
                        },
                        unit_amount: 4900, // $49.00 in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/results?session_id={CHECKOUT_SESSION_ID}&payment_success=true`,
            cancel_url: `${origin}/results?payment_canceled=true`,
            metadata: {
                source: 'web_app_v1'
            }
        });

        res.status(200).json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Checkout Error:', err);
        res.status(500).json({ statusCode: 500, message: err.message });
    }
}
