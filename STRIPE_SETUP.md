# Setting Up Stripe for TRB Alchemy™️

To accept global payments ($49 USD), you need a Stripe account. Follow these steps:

## 1. Create a Stripe Account
1.  Go to [stripe.com](https://stripe.com) and click **Start now**.
2.  **Sign up** with your email and password.
3.  **Verify your email** address.

## 2. Activate Your Account (For Real Payments)
Stripe allows you to test everything without activating, but to accept *real money*, you must activate.
1.  Click **Activate payments** in the dashboard.
2.  Fill in your details:
    *   **Country**: Where you/your business is located.
    *   **Type of business**: Choose "Individual / Sole Proprietor" if you don't have a registered company yet. Otherwise, choose "Company".
    *   **Business Details**: Enter your name/address.
    *   **Bank Account**: Where you want the $49 payments to be deposited.

## 3. Get Your API Keys
1.  Go to the **Developers** tab (top right) -> **API Keys**.
2.  You will see two sets of keys:
    *   **Test Mode** (Toggle "View test data" ON): Keys start with `pk_test_` and `sk_test_`. Use these for testing.
    *   **Live Mode** (Toggle "View test data" OFF): Keys start with `pk_live_` and `sk_live_`. Use these for real customers.

## 4. Connect to Your App
1.  In your project folder, rename `.env.local.example` to `.env.local`.
2.  Open `.env.local` and paste your **Secret Key** (`sk_live_...` or `sk_test_...`):

```bash
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxx
```

## 5. Test It!
1.  If you used **Test Keys**, you can use Stripe's [Test Card Numbers](https://stripe.com/docs/testing) (e.g., 4242 4242 4242 4242) to make a fake purchase.
2.  If you used **Live Keys**, use a real credit card (you can charge yourself $49 and then refund it from the dashboard).
