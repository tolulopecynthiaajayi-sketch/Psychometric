import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { isAdmin } from '@/config/admin';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');

    // Forgot Password State
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [isResetting, setIsResetting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (!auth) {
                throw new Error("Authentication is not configured. (Missing API Keys)");
            }

            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
                // Creating account... redirect to dashboard (admins usually don't sign up this way)
                router.push('/dashboard');
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);

                // Admin Redirect Logic
                if (isAdmin(userCredential.user.email)) {
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }
            }
        } catch (err: any) {
            console.error("Login Error:", err);
            // Friendly error messages
            if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('Invalid email or password.');
            } else {
                setError(err.message);
            }
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetMessage('');
        setError('');
        setIsResetting(true);

        try {
            if (!auth) throw new Error("Auth not ready");
            await sendPasswordResetEmail(auth, resetEmail);
            setResetMessage('Check your email! A password reset link has been sent.');
            setResetEmail(''); // Clear input
        } catch (err: any) {
            console.error("Reset Error:", err);
            if (err.code === 'auth/user-not-found') {
                setError('No user found with that email address.');
            } else {
                setError('Failed to send reset email. Please try again.');
            }
        } finally {
            setIsResetting(false);
        }
    };

    // Render Forgot Password View
    if (showForgotPassword) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-gradient-main)' }}>
                <div className="fade-in-up glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '420px', position: 'relative' }}>
                    {/* Decorative Top Line */}
                    <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '4px', background: 'linear-gradient(90deg, transparent, var(--color-warm-orange), transparent)', borderRadius: '0 0 4px 4px' }} />

                    <h1 className="text-gradient-warm" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>
                        Reset Password
                    </h1>
                    <p style={{ textAlign: 'center', color: 'var(--color-gray-800)', marginBottom: '2rem', lineHeight: 1.6 }}>
                        Enter your email address and we'll send you a magic link to reset your password.
                    </p>

                    {error && <div style={{ background: '#FFF5F5', color: '#C53030', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #FC8181', fontSize: '0.9rem' }}>{error}</div>}
                    {resetMessage && <div style={{ background: '#F0FFF4', color: '#276749', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #68D391', fontSize: '0.9rem', textAlign: 'center' }}>{resetMessage}</div>}

                    <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--color-dark-blue)', fontFamily: 'var(--font-serif)' }}>Email Address</label>
                            <input
                                type="email"
                                required
                                value={resetEmail}
                                onChange={e => setResetEmail(e.target.value)}
                                placeholder="name@example.com"
                                style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--color-gray-200)', background: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isResetting}
                            className="btn-primary-warm"
                            style={{
                                width: '100%',
                                marginTop: '0.5rem',
                                opacity: isResetting ? 0.7 : 1,
                                cursor: isResetting ? 'wait' : 'pointer',
                                fontSize: '1.1rem'
                            }}>
                            {isResetting ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <button
                        onClick={() => { setShowForgotPassword(false); setError(''); setResetMessage(''); }}
                        style={{ width: '100%', padding: '1rem', background: 'none', border: 'none', color: 'var(--color-gray-800)', cursor: 'pointer', marginTop: '1.5rem', fontSize: '0.95rem', fontWeight: '500' }}
                    >
                        ← Back to Log In
                    </button>
                </div>
            </div>
        );
    }

    // Default Login/Signup View
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-gradient-main)' }}>
            <div className="fade-in-up glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '450px', position: 'relative' }}>
                {/* Logo or Brand Element */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-warm-orange) 100%)', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(237, 137, 54, 0.3)' }}>
                        <span style={{ color: 'white', fontSize: '24px' }}>✨</span>
                    </div>
                </div>

                <h1 className="text-gradient-warm" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                    {isSignUp ? 'Join Alchemy' : 'Welcome Back'}
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--color-gray-800)', marginBottom: '2.5rem' }}>
                    {isSignUp ? 'Begin your professional transformation.' : 'Log in to access your dashboard.'}
                </p>

                {error && <div style={{ background: '#FFF5F5', color: '#C53030', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #FC8181', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--color-dark-blue)', fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--color-gray-200)',
                                background: 'rgba(255,255,255,0.9)',
                                fontSize: '1rem',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-peach)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--color-gray-200)'}
                        />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: 'bold', color: 'var(--color-dark-blue)', fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>Password</label>
                            {!isSignUp && (
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    style={{ background: 'none', border: 'none', color: 'var(--color-burnt-orange)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '500' }}
                                >
                                    Forgot Password?
                                </button>
                            )}
                        </div>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--color-gray-200)',
                                background: 'rgba(255,255,255,0.9)',
                                fontSize: '1rem'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-peach)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--color-gray-200)'}
                        />
                    </div>

                    <button type="submit" className="btn-primary-warm" style={{ marginTop: '1rem', fontSize: '1.1rem', width: '100%' }}>
                        {isSignUp ? 'Create Account' : 'Log In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1rem', color: 'var(--color-gray-800)' }}>
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-burnt-orange)', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                    >
                        {isSignUp ? 'Log In' : 'Sign Up'}
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Link href="/" style={{ color: '#A0AEC0', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <span>←</span> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
