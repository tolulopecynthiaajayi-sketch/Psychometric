import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
    return (
        <>
            <Head>
                <title>TRB Alchemy™️ | Digital Psychometric Platform</title>
                <meta name="description" content="Uncover your professional essence." />
            </Head>
            <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

                {/* Hero Section */}
                <section style={{
                    background: 'var(--color-dark-blue)',
                    color: 'white',
                    padding: 'clamp(4rem, 8vw, 6rem) 1rem', // Responsive padding
                    textAlign: 'center',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh' // Ensure full height on mobile
                }}>
                    <div className="container">
                        <h1 style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', // Fluid typography
                            marginBottom: '1.5rem',
                            color: 'var(--color-gold)',
                            lineHeight: 1.1
                        }}>
                            TRB Alchemy™️
                        </h1>
                        <p style={{
                            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                            maxWidth: '600px',
                            margin: '0 auto 3rem',
                            opacity: 0.9,
                            lineHeight: 1.6,
                            padding: '0 10px' // Prevent edge touching
                        }}>
                            Unlock the secrets of your professional DNA. <br />
                            Where insight becomes transformation.
                        </p>

                        <Link href="/onboarding" style={{
                            display: 'inline-block',
                            background: 'var(--color-gold)',
                            color: 'var(--color-dark-blue)',
                            padding: '1.2rem 3rem',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            transition: 'transform 0.2s',
                            cursor: 'pointer',
                            width: 'fit-content',
                            maxWidth: '100%'
                        }}>
                            Begin Your Journey
                        </Link>
                    </div>
                </section>

                {/* Features / tiers */}
                <section style={{ padding: '6rem 1rem', background: 'white' }}>
                    <div className="container" style={{ maxWidth: '1000px' }}>
                        <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-dark-blue)', marginBottom: '4rem' }}>
                            Choose Your Path
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>

                            {/* Free Tier */}
                            <div style={{ padding: '2rem', border: '1px solid var(--color-gray-200)', borderRadius: '12px', textAlign: 'center' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quick Insight</h3>
                                <p style={{ color: 'var(--color-gray-800)', marginBottom: '2rem' }}>A glimpse into your core strengths.</p>
                                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', color: 'var(--color-gray-800)' }}>
                                    <li style={{ marginBottom: '0.5rem' }}>✓ 12 Key Questions</li>
                                    <li style={{ marginBottom: '0.5rem' }}>✓ Basic Summary</li>
                                    <li style={{ opacity: 0.5 }}>✗ Full PDF Report</li>
                                </ul>
                                <Link href="/onboarding" style={{
                                    display: 'block', padding: '1rem', border: '2px solid var(--color-dark-blue)',
                                    color: 'var(--color-dark-blue)', borderRadius: '8px', fontWeight: 'bold'
                                }}>
                                    Start Free
                                </Link>
                            </div>

                            {/* Paid Tier */}
                            <div style={{ padding: '2rem', background: 'var(--color-dark-blue)', color: 'white', borderRadius: '12px', textAlign: 'center', position: 'relative', transform: 'scale(1.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                                <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-gold)', color: 'black', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>Most Popular</div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-gold)' }}>Full Profile</h3>
                                <p style={{ opacity: 0.9, marginBottom: '2rem' }}>Deep dive into your professional essence.</p>
                                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                                    <li style={{ marginBottom: '0.5rem' }}>✓ All 30 Questions</li>
                                    <li style={{ marginBottom: '0.5rem' }}>✓ 6-Dimension Analysis</li>
                                    <li style={{ marginBottom: '0.5rem' }}>✓ Detailed PDF Slide Deck</li>
                                    <li style={{ marginBottom: '0.5rem' }}>✓ Strategy Session Access</li>
                                </ul>
                                <Link href="/onboarding" style={{
                                    display: 'block', padding: '1rem', background: 'var(--color-gold)',
                                    color: 'var(--color-dark-blue)', borderRadius: '8px', fontWeight: 'bold'
                                }}>
                                    Unlock for $49
                                </Link>
                            </div>

                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}
