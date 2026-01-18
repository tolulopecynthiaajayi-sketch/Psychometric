import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { AssessmentProvider } from '@/context/AssessmentContext';
import { AuthProvider } from '@/context/AuthContext';

import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <AssessmentProvider>
                <Head>
                    <title>TRB Alchemy™️ | Digital Psychometric Platform</title>
                    <meta name="description" content="Uncover your professional essence." />
                    <link rel="icon" href="/images/logo-orange-nobg.png" />
                </Head>
                <Component {...pageProps} />
            </AssessmentProvider>
        </AuthProvider>
    );
}
