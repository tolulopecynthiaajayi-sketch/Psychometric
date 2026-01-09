import Head from 'next/head';
import { UserDetailsForm } from '@/components/onboarding/UserDetailsForm';

export default function OnboardingPage() {
    return (
        <>
            <Head>
                <title>Candidate Profile | TRB Alchemy™️</title>
            </Head>
            <main style={{ minHeight: '100vh', padding: '4rem 1rem', background: 'linear-gradient(135deg, #fdfbf7 0%, #fff 100%)' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <UserDetailsForm />
                </div>
            </main>
        </>
    );
}
