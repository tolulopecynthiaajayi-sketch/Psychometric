import React from 'react';
import Head from 'next/head';

export default function AssessmentCompletePage() {
    return (
        <>
            <Head>
                <title>Assessment Complete | TRB Alchemy™️</title>
            </Head>
            <main style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #FFF5F5 0%, #FEFCBF 100%)', // Warm Gradient
                padding: '1rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Background Orbs */}
                <div style={{
                    position: 'absolute', top: -100, left: -100, width: 500, height: 500,
                    background: 'radial-gradient(circle, rgba(237, 137, 54, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                    zIndex: 0
                }} />
                <div style={{
                    position: 'absolute', bottom: -100, right: -100, width: 600, height: 600,
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                    zIndex: 0
                }} />

                <div className="glass-card fade-in-up" style={{
                    maxWidth: '550px',
                    width: '100%',
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>🎉</div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-dark-blue)', marginBottom: '1rem' }}>
                        Assessment Complete!
                    </h1>
                    <p style={{ color: 'var(--color-gray-800)', marginBottom: '3rem', fontSize: '1.2rem', lineHeight: 1.6 }}>
                        Your professional profile has been generated successfully.
                    </p>

                    <a
                        href="/results"
                        className="btn-primary-warm"
                        style={{
                            display: 'inline-block',
                            padding: '1.2rem 3rem',
                            textDecoration: 'none',
                            fontSize: '1.2rem'
                        }}
                    >
                        VIEW MY RESULTS
                    </a>
                </div>
            </main>
        </>
    );
}
