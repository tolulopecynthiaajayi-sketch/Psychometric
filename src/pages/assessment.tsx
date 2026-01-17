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
    const processedRef = React.useRef(false);

    useEffect(() => {
        // Handle Payment Success Return
        if (!router.isReady) return;

        // Use ref to prevent double-firing or loops during re-renders
        if (router.query.payment_success === 'true' && !processedRef.current) {
            console.log("Processing payment return...");
            processedRef.current = true; // Lock immediately
            setIsProcessingPayment(true);
            setPremium(true);

            // Clean URL and THEN unlock UI
            router.replace('/assessment', undefined, { shallow: true })
                .then(() => {
                    // Slight delay to ensure Context propagates and UI stabilizes
                    setTimeout(() => {
                        setIsProcessingPayment(false);
                    }, 1000); // Increased stability delay
                })
                .catch(err => {
                    console.error("Navigation failed", err);
                    setIsProcessingPayment(false); // recover
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
    }, [userProfile, router.isReady, router.query, setPremium]);

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
                <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Finalizing your access...</h2>
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

    // Prevent hydration flash/glitch where questions show before "Finalising..."
    if (!router.isReady) return null;

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
                <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Finalizing your access...</h2>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-gray-200)', borderTopColor: 'var(--color-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style jsx>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Assessment | TRB Alchemy™️</title>
            </Head>
            <main style={{
                minHeight: '100vh',
                padding: 'clamp(2rem, 5vw, 4rem) 1rem',
                background: 'linear-gradient(135deg, #FFFAF0 0%, #FDF2F8 100%)', // Calm Warm Gradient
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div className="container" style={{ maxWidth: '900px', width: '100%' }}>

                    {/* Progress Bar (Calm & Thick) */}
                    <div style={{ marginBottom: '4rem', maxWidth: '700px', margin: '0 auto 4rem auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--color-dark-blue)', fontWeight: 'bold' }}>
                                Question {currentQuestionIndex + 1} <span style={{ color: '#CBD5E0', fontWeight: 'normal' }}>/ {totalQuestions}</span>
                            </span>
                            <span style={{ color: 'var(--color-warm-orange)', fontWeight: 'bold', fontSize: '1rem' }}>{Math.round(progress)}% Complete</span>
                        </div>
                        <div style={{ height: '14px', background: 'rgba(255,255,255,0.5)', borderRadius: '10px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                            <div style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, #F6AD55 0%, #ED8936 50%, #D4AF37 100%)',
                                width: `${progress}%`,
                                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                borderRadius: '10px',
                                boxShadow: '0 2px 10px rgba(237, 137, 54, 0.3)'
                            }} />
                        </div>
                    </div>

                    {/* Question Interface (Glass Card) */}
                    <div className="glass-card fade-in-up" style={{ padding: 'clamp(2rem, 5vw, 4rem)', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <QuestionRenderer
                            question={currentQuestion}
                            currentAnswer={currentAnswer}
                            onAnswer={handleAnswer}
                        />


                        {/* Navigation Controls */}
                        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2rem' }}>
                            <button
                                onClick={prevQuestion}
                                disabled={currentQuestionIndex === 0}
                                style={{
                                    padding: '0.8rem 2rem',
                                    border: 'none',
                                    background: 'transparent',
                                    color: currentQuestionIndex === 0 ? '#CBD5E0' : 'var(--color-gray-800)',
                                    cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    transition: 'color 0.2s'
                                }}
                            >
                                ← Previous
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
                                        className="btn-primary-warm"
                                        style={{
                                            fontSize: '1.1rem',
                                            padding: '1rem 3rem'
                                        }}
                                    >
                                        FINALISE ASSESSMENT ➔
                                    </button>
                                    <div style={{ marginTop: '10px', fontSize: '0.8rem', textAlign: 'center' }}>
                                        <span style={{ opacity: 0.7 }}>Not redirecting? </span>
                                        <a href="/assessment-complete" style={{ color: 'var(--color-warm-orange)', textDecoration: 'underline', cursor: 'pointer', position: 'relative', zIndex: 100001 }}>
                                            Click here
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    key="next-btn"
                                    onClick={nextQuestion}
                                    className="btn-primary-warm"
                                    style={{
                                        fontSize: '1.2rem',
                                        padding: '1rem 3rem'
                                    }}
                                >
                                    Next ➔
                                </button>
                            )}
                        </div>
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
