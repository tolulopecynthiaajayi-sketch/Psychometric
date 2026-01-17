import React from 'react';
import Head from 'next/head';

export default function AssessmentCompletePage() {
    return (
        <>
            <Head>
                <title>Assessment Complete | TRB Alchemy™️</title>
            </Head>
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7fafc', padding: '1rem' }}>
                <div className="container" style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem 2rem', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-dark-blue)', marginBottom: '1rem' }}>
                        Assessment Complete!
                    </h1>
                    <p style={{ color: 'var(--color-gray-600)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                        Your professional profile has been generated.
                        <br />Click below to view your insights.
                    </p>

                    <a
                        href="/results"
                        style={{
                            display: 'inline-block',
                            padding: '1rem 2.5rem',
                            background: 'var(--color-gold)',
                            color: 'black',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s'
                        }}
                    >
                        VIEW MY RESULTS
                    </a>
                </div>
            </main>
        </>
    );
}
