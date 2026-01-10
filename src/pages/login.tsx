import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (!auth) {
                throw new Error("Authentication is not configured. (Missing API Keys)");
            }

            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
                // Creating account... redirect to assessment or dashboard
                router.push('/dashboard');
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7FAFC' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
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
                    </div>

                    <button type="submit" style={{ background: '#DD6B20', color: 'white', padding: '0.8rem', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '1rem' }}>
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
