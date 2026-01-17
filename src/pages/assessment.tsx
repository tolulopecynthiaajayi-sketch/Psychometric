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

    const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

    useEffect(() => {
        // Handle Payment Success Return
        if (!router.isReady) return;

        if (router.query.payment_success === 'true') {
            console.log("Processing payment return...");
            setIsProcessingPayment(true);
            setPremium(true);

            // Clean URL and THEN unlock UI
            router.replace('/assessment', undefined, { shallow: true })
                .then(() => {
                    // Slight delay to ensure Context propagates and UI stabilizes
                    setTimeout(() => {
                        setIsProcessingPayment(false);
                    }, 500);
                });
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
        // 1. Wait for Router to be ready (so we can read query params)
        if (!router.isReady) return;

        // 2. Don't redirect if we are processing a payment return.
        if (router.query.payment_success || isProcessingPayment) return;

        // 3. Only then, check isComplete
        if (isComplete) {
            window.location.href = '/assessment-complete';
        }
    }, [isComplete, router.isReady, router.query.payment_success, isProcessingPayment]);

    const currentQuestion = activeQuestions[currentQuestionIndex];

    // Guard against undefined (e.g. during state transitions)
    if (!currentQuestion) return null;

    if (isProcessingPayment) {
        return (
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 99999,
                color: 'var(--color-dark-blue)'
            }}>
                <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Finishing your upgrade...</h2>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-gray-200)', borderTopColor: 'var(--color-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style jsx>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    const currentAnswer = answers[currentQuestion.id];

    const handleAnswer = (value: number) => {
        // Save answer to state
        setAnswer(currentQuestion.id, value);

        // Update LocalStorage immediately for safety
        try {
            const currentState = JSON.parse(localStorage.getItem('trb_assessment_state') || '{}');
            currentState.answers = { ...currentState.answers, [currentQuestion.id]: value };
            // We DO NOT set isComplete here anymore. 
            // The user must click "Finalise Assessment" explicitly.
            localStorage.setItem('trb_assessment_state', JSON.stringify(currentState));
        } catch (e: any) {
            console.error("Save failed", e);
        }

        // If it's the last question, WE STOP HERE.
        // No auto-advance, no auto-redirect.
        if (currentQuestionIndex === totalQuestions - 1) {
            return;
        }

        // Otherwise, Auto-advance
        setTimeout(() => {
            nextQuestion();
        }, 300);
    };

    const handleUpgrade = async () => {
        // Mock upgrade
        setPremium(true);
        closeUpsell();
        router.push('/assessment');
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
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 100000 }}>
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
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const btn = e.currentTarget;
                                        btn.innerText = "PROCESSING...";
                                        btn.style.opacity = "0.7";

                                        // 1. Save Data (Synchronous)
                                        try {
                                            const currentState = JSON.parse(localStorage.getItem('trb_assessment_state') || '{}');
                                            currentState.isComplete = true;
                                            localStorage.setItem('trb_assessment_state', JSON.stringify(currentState));
                                        } catch (err) {
                                            console.error("Save error", err);
                                        }

                                        // 2. Force Hard Navigation
                                        setTimeout(() => {
                                            console.log("Forcing navigation...");
                                            window.location.assign("/assessment-complete");
                                        }, 50);
                                    }}
                                    style={{
                                        border: 'none',
                                        padding: '0.8rem 1.5rem',
                                        background: 'var(--color-dark-blue)',
                                        color: 'white',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        position: 'relative',
                                        zIndex: 100001, // NUCLEAR PLUS ONE
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    FINALISE ASSESSMENT ➔
                                </button>
                                <div style={{ marginTop: '10px', fontSize: '0.8rem', textAlign: 'center' }}>
                                    <span style={{ opacity: 0.7 }}>Not redirecting? </span>
                                    <a href="/assessment-complete" style={{ color: 'var(--color-gold)', textDecoration: 'underline', cursor: 'pointer', position: 'relative', zIndex: 100001 }}>
                                        Click here
                                    </a>
                                </div>
                            </div>
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
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                Next ➔
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
            </main>
        </>
    );
}
