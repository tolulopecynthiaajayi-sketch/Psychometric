import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { AssessmentProvider } from '@/context/AssessmentContext';
import { AuthProvider } from '@/context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <AssessmentProvider>
                <Component {...pageProps} />
            </AssessmentProvider>
        </AuthProvider>
    );
}
