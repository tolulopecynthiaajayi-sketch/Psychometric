import Head from 'next/head';
import { UserDetailsForm } from '@/components/onboarding/UserDetailsForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function OnboardingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=/onboarding');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>Candidate Profile | TRB Alchemy™️</title>
            </Head>
            <main style={{
                minHeight: '100vh',
                padding: '4rem 1rem',
                background: 'linear-gradient(135deg, #FFF5F5 0%, #FEFCBF 100%)', // Soft Peach/Lemon gradient
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/* Decorative Background Orbs */}
                <div style={{
                    position: 'absolute', top: -100, left: -100, width: 600, height: 600,
                    background: 'radial-gradient(circle, rgba(237, 137, 54, 0.2) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                    zIndex: 0
                }} />
                <div style={{
                    position: 'absolute', bottom: -150, right: -150, width: 700, height: 700,
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                    zIndex: 0
                }} />

                <div className="container" style={{ maxWidth: '700px', position: 'relative', zIndex: 1 }}>
                    <div className="glass-card fade-in-up" style={{ padding: '3rem 2rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <img src="/images/logo-orange-nobg.png" alt="TRB Alchemy" style={{ width: '80px', marginBottom: '1rem' }} />
                            <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-dark-blue)', marginBottom: '0.5rem' }}>Let's Get Started</h1>
                            <p style={{ color: 'var(--color-gray-800)', fontSize: '1.1rem' }}>Enter your details to begin your profiling journey.</p>
                        </div>

                        <UserDetailsForm />
                    </div>
                </div>
            </main>
        </>
    );
}
