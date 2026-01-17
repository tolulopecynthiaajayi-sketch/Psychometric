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
                // Only redirect if state is seemingly initialized (e.g. currentQuestionIndex is valid or answers present)
                // or if enough time has passed to be sure.
                router.replace('/onboarding');
            }
        }, 1000);
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
        // If it's the last question, we override normal behavior
        if (currentQuestionIndex === totalQuestions - 1) {

            // 1. SAVE DATA (Paranoid Mode)
            try {
                const currentState = JSON.parse(localStorage.getItem('trb_assessment_state') || '{}');
                currentState.answers = { ...currentState.answers, [currentQuestion.id]: value };
                currentState.isComplete = true;
                localStorage.setItem('trb_assessment_state', JSON.stringify(currentState));
            } catch (e: any) {
                console.error("Save failed", e);
            }

            // 2. FORCE NAVIGATION (Absolute)
            setTimeout(() => {
                window.location.replace('/assessment-complete');
            }, 50);
            return;
        }

        setAnswer(currentQuestion.id, value);

        // Auto-advance
        setTimeout(() => {
            nextQuestion();
        }, 300);
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

                        {currentQuestionIndex === totalQuestions - 1 ? (
                            <a
                                href="/assessment-complete"
                                onClick={(e) => {
                                    // 1. Try to save data
                                    try {
                                        const currentState = JSON.parse(localStorage.getItem('trb_assessment_state') || '{}');
                                        currentState.isComplete = true;
                                        localStorage.setItem('trb_assessment_state', JSON.stringify(currentState));
                                    } catch (err) {
                                        console.error("Save error", err);
                                    }

                                    // 2. Allow default link behavior to proceed
                                    // We DO NOT call e.preventDefault() here.
                                    // We let the browser handle the navigation naturally.
                                }}
                                style={{
                                    textDecoration: 'none',
                                    padding: '0.8rem 1.5rem',
                                    background: 'var(--color-dark-blue)',
                                    color: 'white',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    userSelect: 'none'
                                }}
                            >
                                FINALISE ASSESSMENT ➔
                            </a>
                        ) : (
                            <button
                                key="next-btn"
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
                                Next
                            </button>
                        )}
                    </div>

                </div>

                {/* Upsell Modal */}
                <PricingModal
                    isOpen={showUpsell}
                    onClose={closeUpsell}
                    onUpgrade={handleUpgrade}
                />
            </main >
        </>
    );
}
