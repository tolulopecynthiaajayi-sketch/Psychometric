import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAssessment } from '@/context/AssessmentContext';
import { QuestionRenderer } from '@/components/assessment/QuestionRenderer';
import { PricingModal } from '@/components/payment/PricingModal';

export default function AssessmentPage() {
    const router = useRouter();
    const {
        currentQuestionIndex,
        activeQuestions,
        totalQuestions,
        answers,
        setAnswer,
        nextQuestion,
        prevQuestion,
        isComplete,
        showUpsell,
        closeUpsell,
        setPremium,
        userProfile,
        completeAssessment
    } = useAssessment();

    const [isNavigating, setIsNavigating] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);

    useEffect(() => {
        // Handle Payment Success Return
        if (router.query.payment_success === 'true') {
            setPremium(true);
            // Clean URL
            router.replace('/assessment', undefined, { shallow: true });
        }

        // Guard: If no user profile (bypassed onboarding), redirect to start
        const checkProfile = setTimeout(() => {
            if (!userProfile) {
                router.replace('/onboarding');
            }
        }, 100);
        return () => clearTimeout(checkProfile);
    }, [userProfile, router, setPremium]);

    const currentQuestion = activeQuestions[currentQuestionIndex];

    // Guard against undefined (e.g. during state transitions)
    if (!currentQuestion) return null;

    const currentAnswer = answers[currentQuestion.id];

    const handleAnswer = (value: number) => {
        setAnswer(currentQuestion.id, value);

        // Auto-advance after small delay
        setTimeout(() => {
            if (currentQuestionIndex === totalQuestions - 1) {
                // FORCE SUCCESS VIEW LOCALLY
                setShowSuccess(true);
                completeAssessment();
            } else {
                nextQuestion();
            }
        }, 400);
    };

    const handleUpgrade = async () => {
        // Mock upgrade
        setPremium(true);
        closeUpsell();
    };

    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    // SUCCESS VIEW: Rendered when assessment is marked complete OR locally forced
    if (isComplete || showSuccess) {
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

    return (
        <>
            <Head>
                <title>Assessment | TRB Alchemy™️</title>
            </Head>
            <main style={{ minHeight: '100vh', padding: 'clamp(1rem, 4vw, 2rem) 0' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    {/* Progress Bar */}
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-gray-800)' }}>
                            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
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
                            onClick={() => {
                                if (currentQuestionIndex === totalQuestions - 1) {
                                    setShowSuccess(true);
                                    completeAssessment();
                                } else {
                                    nextQuestion();
                                }
                            }}
                            style={{
                                padding: '0.8rem 1.5rem',
                                background: 'var(--color-dark-blue)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {currentQuestionIndex === totalQuestions - 1 ? 'FINISH ASSESSMENT' : 'Next'}
                        </button>
                    </div>
                </div>

                {/* Upsell Modal - (Optional: Kept if we want to force upgrade at certain points, but logic moved to Results) */}
                < PricingModal
                    isOpen={showUpsell}
                    onClose={closeUpsell}
                    onUpgrade={handleUpgrade}
                />
            </main >
        </>
    );
}
