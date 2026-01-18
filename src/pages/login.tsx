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
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7FAFC' }}>
                <div className="fade-in-up" style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                    <h1 style={{ textAlign: 'center', fontFamily: 'serif', fontSize: '1.8rem', color: '#2C5282', marginBottom: '1rem' }}>
                        Reset Password
                    </h1>
                    <p style={{ textAlign: 'center', color: '#718096', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    {error && <div style={{ background: '#FED7D7', color: '#C53030', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                    {resetMessage && <div style={{ background: '#C6F6D5', color: '#22543D', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{resetMessage}</div>}

                    <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#4A5568' }}>Email</label>
                            <input
                                type="email"
                                required
                                value={resetEmail}
                                onChange={e => setResetEmail(e.target.value)}
                                placeholder="Enter your registered email"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isResetting}
                            style={{
                                background: isResetting ? '#CBD5E0' : '#3182CE',
                                color: 'white',
                                padding: '0.8rem',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                border: 'none',
                                cursor: isResetting ? 'wait' : 'pointer',
                                marginTop: '0.5rem'
                            }}>
                            {isResetting ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <button
                        onClick={() => { setShowForgotPassword(false); setError(''); setResetMessage(''); }}
                        style={{ width: '100%', padding: '0.8rem', background: 'none', border: 'none', color: '#718096', cursor: 'pointer', marginTop: '1rem' }}
                    >
                        Back to Log In
                    </button>
                </div>
            </div>
        );
    }

    // Default Login/Signup View
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7FAFC' }}>
            <div className="fade-in-up" style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ textAlign: 'center', fontFamily: 'serif', fontSize: '2rem', color: '#2C5282', marginBottom: '1.5rem' }}>
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h1>

                {error && <div style={{ background: '#FED7D7', color: '#C53030', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#4A5568' }}>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#4A5568' }}>Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                        />
                        {!isSignUp && (
                            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    style={{ background: 'none', border: 'none', color: '#3182CE', fontSize: '0.85rem', cursor: 'pointer' }}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}
                    </div>

                    <button type="submit" style={{ background: '#DD6B20', color: 'white', padding: '0.8rem', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}>
                        {isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#718096' }}>
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{ background: 'none', border: 'none', color: '#3182CE', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {isSignUp ? 'Log In' : 'Sign Up'}
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Link href="/" style={{ color: '#A0AEC0', fontSize: '0.9rem', textDecoration: 'none' }}>← Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
