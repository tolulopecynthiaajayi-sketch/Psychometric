import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
    const { user } = useAuth();
    return (
        <>
            <Head>
                <title>TRB Alchemy™️ | Digital Psychometric Platform</title>
                <meta name="description" content="Uncover your professional essence." />
            </Head>
            <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

                {/* Hero Section */}
                <section style={{
                    background: 'radial-gradient(circle at 50% 50%, #2D3748 0%, #171923 100%)', // Deep, spotlight effect
                    color: 'white',
                    padding: 'clamp(4rem, 8vw, 6rem) 1rem', // Responsive padding
                    textAlign: 'center',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '85vh', // Taller hero
                    position: 'relative',
                    overflow: 'hidden',
                    width: '100%' // Ensure it doesn't expand beyond viewport
                }}>
                    {/* Navigation Header */}
                    <nav style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        padding: '1.5rem',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        zIndex: 10
                    }}>
                        {user ? (
                            <Link href="/dashboard" style={{
                                color: 'white',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                border: '1px solid rgba(255,255,255,0.3)',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '30px',
                                background: 'rgba(0,0,0,0.2)',
                                backdropFilter: 'blur(5px)'
                            }}>
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <Link href="/login" style={{
                                color: 'white',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                opacity: 0.9,
                                padding: '0.5rem 1rem', // Added padding
                                display: 'inline-block' // Ensure padding works
                            }}>
                                Login to Account
                            </Link>
                        )}
                    </nav>
                    {/* Decorative Background Elements */}
                    <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(237, 137, 54, 0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(192, 86, 33, 0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />

                    <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        {/* HERO LOGO - Main Identity */}
                        <img
                            src="/images/logo-white.png"
                            alt="TRB Alchemy Logo"
                            style={{
                                width: 'min(300px, 80vw)', // Responsive width
                                marginBottom: '2rem',
                                filter: 'drop-shadow(0 0 20px rgba(237, 137, 54, 0.3))' // Glow effect
                            }}
                        />

                        <h1 style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)', // Slightly smaller than before to let logo shine
                            marginBottom: '1.5rem',
                            color: '#FBD38D', // Gold text
                            lineHeight: 1.1,
                            fontWeight: '300',
                            letterSpacing: '1px'
                        }}>
                            Unlock the secrets of your <br /> <span style={{ fontWeight: 'bold', color: 'white' }}>Professional DNA</span>.
                        </h1>
                        <p style={{
                            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                            maxWidth: '600px',
                            margin: '0 auto 3rem',
                            opacity: 0.9,
                            lineHeight: 1.6,
                            color: '#E2E8F0'
                        }}>
                            Where insight becomes transformation.
                        </p>

                        <Link href="/onboarding" style={{
                            display: 'inline-block',
                            background: 'linear-gradient(90deg, #ED8936 0%, #C05621 100%)', // Gradient Button
                            color: 'white',
                            padding: '1.2rem 3.5rem',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            boxShadow: '0 10px 25px rgba(237, 137, 54, 0.4)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            Begin Your Journey
                        </Link>
                    </div>
                </section>

                {/* Features / tiers */}
                {/* Content Section: Educational instead of Transactional */}
                <section style={{ padding: '6rem 1rem', background: 'white' }}>
                    <div className="container" style={{ maxWidth: '900px' }}>

                        {/* What is it? */}
                        <div style={{ marginBottom: '6rem' }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-dark-blue)', marginBottom: '1.5rem', textAlign: 'center' }}>
                                What is the Alchemy Profile?
                            </h2>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--color-gray-800)', textAlign: 'center' }}>
                                The Alchemy Profile is a sophisticated psychometric instrument designed to decode your professional DNA.
                                Unlike standard personality tests, it measures six critical dimensions of leadership and influence—from
                                <strong> Cognitive Agility</strong> to <strong>Drivers of Motivation</strong>. It offers a mirror to your potential, revealing not just who you are,
                                but who you could become.
                            </p>
                        </div>

                        {/* Who is TRB? */}
                        <div style={{ marginBottom: '6rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-dark-blue)', marginBottom: '1.5rem', textAlign: 'center' }}>
                                About Temitope Richard-Banji
                            </h2>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--color-gray-800)', textAlign: 'center', marginBottom: '2rem' }}>
                                Built from years of hands-on experience mentoring professionals, advising leaders, and assessing talent across industries,
                                TRB Alchemy refers to the proprietary framework developed by Temitope Richard-Banji. It goes beyond conventional psychometrics
                                to interpret how people think, lead, influence, and grow, converting those insights into practical developmental guidance.
                            </p>
                        </div>

                        {/* Why Take It? */}
                        <div style={{ marginBottom: '4rem' }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-dark-blue)', marginBottom: '2rem', textAlign: 'center' }}>
                                Why Take This Assessment?
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                                <div style={{ padding: '1.5rem', background: '#F7FAFC', borderRadius: '8px' }}>
                                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Clarity</h3>
                                    <p>Gain a precise understanding of your operational style and hidden blind spots.</p>
                                </div>
                                <div style={{ padding: '1.5rem', background: '#F7FAFC', borderRadius: '8px' }}>
                                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Strategy</h3>
                                    <p>Receive concrete recommendations to accelerate your career trajectory.</p>
                                </div>
                                <div style={{ padding: '1.5rem', background: '#F7FAFC', borderRadius: '8px' }}>
                                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Growth</h3>
                                    <p>Unlock detailed insights that serve as a roadmap for your next 90 days and beyond.</p>
                                </div>
                            </div>
                        </div>

                        {/* Final CTA */}
                        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                            <Link href="/onboarding" style={{
                                display: 'inline-block',
                                background: 'var(--color-dark-blue)',
                                color: 'white',
                                padding: '1.2rem 3rem',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                borderRadius: '50px',
                                transition: 'transform 0.2s',
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px 0 rgba(0,0,0,0.39)'
                            }}>
                                Begin Your Assessment
                            </Link>
                        </div>

                    </div>
                </section>

            </main>
        </>
    );
}
