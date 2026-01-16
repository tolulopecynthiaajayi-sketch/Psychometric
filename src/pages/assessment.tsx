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

    const currentQuestion = activeQuestions[currentQuestionIndex];

    // Guard against undefined (e.g. during state transitions)
    if (!currentQuestion) return null;

    const currentAnswer = answers[currentQuestion.id];

    const handleAnswer = (value: number) => {
        setAnswer(currentQuestion.id, value);
        // Auto-advance after small delay
        setTimeout(() => {
            nextQuestion();
        }, 400);
    };

    const handleUpgrade = async () => {
        // Mock upgrade
        setPremium(true);
        closeUpsell();
    };

    <button
        disabled={isNavigating}
        onClick={async () => {
            try {
                if (currentQuestionIndex === totalQuestions - 1) {
                    setIsNavigating(true);
                    completeAssessment();
                    // "Nuclear Option": Force hard navigation to bypass any router hangs
                    window.location.href = '/results';
                } else {
                    nextQuestion();
                }
            } catch (err: any) {
                console.error("Navigation Error:", err);
                setIsNavigating(false);
                alert("Something went wrong. Please refresh the page.");
            }
        }}
        style={{
            padding: '0.8rem 1.5rem',
            background: isNavigating ? 'var(--color-gray-400)' : 'var(--color-dark-blue)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isNavigating ? 'wait' : 'pointer',
            opacity: isNavigating ? 0.8 : 1
        }}
    >
        {isNavigating ? 'Processing...' : (currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next')}
    </button>
                    </div >
                </div >

        {/* Upsell Modal - (Optional: Kept if we want to force upgrade at certain points, but logic moved to Results) */ }
        < PricingModal
    isOpen = { showUpsell }
    onClose = { closeUpsell }
    onUpgrade = { handleUpgrade }
        />
            </main >
        </>
    );
}
