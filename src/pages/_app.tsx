import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { AssessmentProvider } from '@/context/AssessmentContext';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AssessmentProvider>
            <Component {...pageProps} />
        </AssessmentProvider>
    );
}
