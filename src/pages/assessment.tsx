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

    // DEBUG: Visible Logger
    const [logs, setLogs] = React.useState<string[]>([]);
    const addLog = (msg: string) => setLogs(p => [...p, `${new Date().toISOString().split('T')[1].slice(0, 8)}: ${msg}`].slice(-5));

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
        addLog(`Ans: ${value} Idx: ${currentQuestionIndex}`);

        // CRITICAL FIX: If last question, bypass React State entirely to prevent render loops
        if (currentQuestionIndex === totalQuestions - 1) {
            addLog('Last Q detected. Saving direct...');
            try {
                // 1. Construct new state manually
                const currentState = JSON.parse(localStorage.getItem('trb_assessment_state') || '{}');
                currentState.answers = { ...currentState.answers, [currentQuestion.id]: value };
                currentState.isComplete = true; // Mark complete

                // 2. Write to storage synchronously
                localStorage.setItem('trb_assessment_state', JSON.stringify(currentState));
                addLog('Saved. Navigating...');

                // 3. Force Hard Redirect
                window.location.href = '/assessment-complete';
            } catch (e) {
                addLog(`Err: ${e}`);
                // Fallback
                setAnswer(currentQuestion.id, value);
                nextQuestion();
            }
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
                            /* NUCLEAR OPTION: Form Submission */
                            /* Browsers handle form actions with highest priority, breaking JS loops */
                            <form action="/assessment-complete" method="GET">
                                <button
                                    type="submit"
                                    onClick={(e) => {
                                        // Optional: Ensure storage is synced one last time
                                        addLog('Form Submit Clicked');
                                    }}
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
                                    FINALISE ASSESSMENT ➔
                                </button>
                            </form>
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

                    {/* DEBUG CONSOLE: Live visible feedback for user */}
                    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.8)', color: '#0f0', fontSize: '10px', padding: '4px', fontFamily: 'monospace', pointerEvents: 'none', zIndex: 9999 }}>
                        {logs.map((L, i) => <div key={i}>{L}</div>)}
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
