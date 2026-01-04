import Head from 'next/head';

export default function Home() {
    return (
        <>
            <Head>
                <title>TRB Alchemy™️ | Digital Psychometric Platform</title>
                <meta name="description" content="Uncover your professional essence." />
            </Head>
            <main>
                <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'var(--color-dark-blue)' }}>
                        TRB Alchemy™️
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--color-gray-800)', marginTop: '1rem' }}>
                        Where insight becomes transformation.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <button style={{
                            background: 'var(--color-gold)',
                            color: 'var(--color-black)',
                            border: 'none',
                            padding: '1rem 2rem',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}>
                            Start Assessment
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
