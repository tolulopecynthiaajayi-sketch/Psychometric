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

    // SAFETY NET: Watch for completion state
    // If the button logic somehow fails or runs "Next" instead of "Finish",
    // this hook catches the state change and forces the redirect anyway.
    useEffect(() => {
        if (isComplete) {
            window.location.href = '/assessment-complete';
        }
    }, [isComplete]);

    const currentQuestion = activeQuestions[currentQuestionIndex];

    // Guard against undefined (e.g. during state transitions)
    if (!currentQuestion) return null;

    const currentAnswer = answers[currentQuestion.id];

    const handleAnswer = (value: number) => {
        setAnswer(currentQuestion.id, value);

        // Auto-advance after small delay
        setTimeout(() => {
            if (currentQuestionIndex === totalQuestions - 1) {
                // FORCE HARD NAVIGATION TO DEDICATED SUCCESS PAGE
                window.location.href = '/assessment-complete';
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
                            // STALE CLOSURE VACCINE: The 'key' forces React to destroy and recreate the button
                            // whenever we switch between "Next" and "Finish". This ensures the onClick handler
                            // is always fresh and never using old logic.
                            key={currentQuestionIndex === totalQuestions - 1 ? 'finish-btn' : 'next-btn'}
                            onClick={() => {
                                if (currentQuestionIndex === totalQuestions - 1) {
                                    window.location.href = '/assessment-complete';
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
