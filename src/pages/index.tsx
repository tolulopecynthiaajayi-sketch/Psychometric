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
                                About TRB Alchemy
                            </h2>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--color-gray-800)', textAlign: 'center', marginBottom: '2rem' }}>
                                TRB Alchemy is a premier human capital development firm dedicated to transforming potential into performance.
                                We believe that self-awareness is the catalyst for all great leadership. Our tools are built on decades of
                                research and practical application in high-performance environments.
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
