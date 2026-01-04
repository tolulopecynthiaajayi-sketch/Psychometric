import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAssessment } from '@/context/AssessmentContext';
import { QuestionRenderer } from '@/components/assessment/QuestionRenderer';
import { PricingModal } from '@/components/payment/PricingModal';
import { QUESTIONS } from '@/config/assessment';

export default function AssessmentPage() {
    const router = useRouter();
    const {
        currentQuestionIndex,
        answers,
        setAnswer,
        nextQuestion,
        prevQuestion,
        isComplete,
        showUpsell,
        closeUpsell,
        setPremium
    } = useAssessment();

    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion.id];

    const handleAnswer = (value: number) => {
        setAnswer(currentQuestion.id, value);
        // Auto-advance after small delay
        setTimeout(() => {
            if (currentQuestionIndex < QUESTIONS.length - 1) {
                nextQuestion();
            } else {
                // Last question logic could be here
            }
        }, 400);
    };

    const handleUpgrade = async () => {
        // In real app, redirect to Stripe
        const res = await fetch('/api/checkout', { method: 'POST' });
        const data = await res.json();
        console.log(data);

        // For MVP demo, just unlock
        setPremium(true);
        closeUpsell();
    };

    useEffect(() => {
        if (isComplete) {
            router.push('/results');
        }
    }, [isComplete, router]);

    const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

    return (
        <>
            <Head>
                <title>Assessment | TRB Alchemy™️</title>
            </Head>
            <main style={{ minHeight: '100vh', padding: '2rem 0' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    {/* Progress Bar */}
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-gray-800)' }}>
                            <span>Question {currentQuestionIndex + 1} of {QUESTIONS.length}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--color-gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: 'var(--color-gold)', width: `${progress}%`, transition: 'width 0.3s ease' }} />
                        </div>
                    </div>

                    {/* Question Interface */}
                    <QuestionRenderer
                        question={currentQuestion}
                        currentAnswer={currentAnswer}
                        onAnswer={handleAnswer}
                    />

                    {/* Navigation Controls */}
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                        <button
                            onClick={prevQuestion}
                            disabled={currentQuestionIndex === 0}
                            style={{
                                padding: '0.8rem 1.5rem',
                                border: '1px solid var(--color-gray-200)',
                                background: 'white',
                                borderRadius: '4px',
                                cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                                opacity: currentQuestionIndex === 0 ? 0.5 : 1
                            }}
                        >
                            Previous
                        </button>

                        <button
                            onClick={nextQuestion}
                            style={{
                                padding: '0.8rem 1.5rem',
                                background: 'var(--color-dark-blue)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {currentQuestionIndex === QUESTIONS.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>

                {/* Upsell Modal */}
                <PricingModal
                    isOpen={showUpsell}
                    onClose={closeUpsell}
                    onUpgrade={handleUpgrade}
                />
            </main>
        </>
    );
}
