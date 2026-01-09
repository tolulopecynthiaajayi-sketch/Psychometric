import React, { createContext, useContext, useEffect, useState } from 'react';
import { QUESTIONS, Question, UserProfile, PRICE_TIERS } from '@/config/assessment';

interface AssessmentState {
    answers: Record<string, number>;
    currentQuestionId: string;
    isPremium: boolean;
    isComplete: boolean;
    showUpsell: boolean;
    userProfile: UserProfile | null;
}

interface AssessmentContextType extends AssessmentState {
    setAnswer: (questionId: string, value: number) => void;
    nextQuestion: () => void;
    prevQuestion: () => void;
    setPremium: (status: boolean) => void;
    closeUpsell: () => void;
    completeAssessment: () => void;
    resetAssessment: () => void;
    setUserProfile: (profile: UserProfile) => void;
    activeQuestions: Question[];
    currentQuestionIndex: number;
    totalQuestions: number;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AssessmentState>({
        answers: {},
        currentQuestionId: QUESTIONS[0].id,
        isPremium: false,
        isComplete: false,
        showUpsell: false,
        userProfile: null,
    });

    // Derived state: Get list of questions based on premium status
    const activeQuestions = React.useMemo(() => {
        if (state.isPremium) return QUESTIONS;
        return QUESTIONS.filter(q => q.isFreeTier);
    }, [state.isPremium]);

    const currentQuestionIndex = activeQuestions.findIndex(q => q.id === state.currentQuestionId);

    // Safe fallback if current ID is not in active list (e.g. after upgrade or state weirdness)
    const safeIndex = currentQuestionIndex === -1 ? 0 : currentQuestionIndex;

    // Load state from localStorage
    useEffect(() => {
        const savedState = localStorage.getItem('trb_assessment_state');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            // Migrate old index-based state to ID-based if needed (or just reset if too complex)
            if (typeof parsed.currentQuestionIndex === 'number' && !parsed.currentQuestionId) {
                // Should ideally map old index to ID, but for safety in dev:
                parsed.currentQuestionId = QUESTIONS[0].id;
            }
            // Ensure userProfile is preserved if it exists, or null
            setState({
                ...parsed,
                showUpsell: parsed.showUpsell || false,
                userProfile: parsed.userProfile || null
            });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('trb_assessment_state', JSON.stringify(state));
    }, [state]);

    const setUserProfile = (profile: UserProfile) => {
        setState((prev) => ({ ...prev, userProfile: profile }));
    };

    const setAnswer = (questionId: string, value: number) => {
        setState((prev) => ({
            ...prev,
            answers: { ...prev.answers, [questionId]: value },
        }));
    };

    const nextQuestion = () => {
        const currentIndex = activeQuestions.findIndex(q => q.id === state.currentQuestionId);

        // Check if last question
        if (currentIndex >= activeQuestions.length - 1) {
            // If Free user finishing their set, just complete (generic report).
            // They can upgrade later from results page.
            completeAssessment();
            return;
        }

        const nextId = activeQuestions[currentIndex + 1].id;
        setState((prev) => ({ ...prev, currentQuestionId: nextId }));
    };

    const prevQuestion = () => {
        const currentIndex = activeQuestions.findIndex(q => q.id === state.currentQuestionId);
        if (currentIndex > 0) {
            const prevId = activeQuestions[currentIndex - 1].id;
            setState((prev) => ({ ...prev, currentQuestionId: prevId }));
        }
    };

    const setPremium = (status: boolean) => {
        // When upgrading, we likely want to keep current progress but unlock rest.
        setState((prev) => {
            return { ...prev, isPremium: status, showUpsell: false, isComplete: false };
        });
    };

    const closeUpsell = () => {
        setState((prev) => ({ ...prev, showUpsell: false }));
    };

    const completeAssessment = () => {
        setState((prev) => ({ ...prev, isComplete: true }));
    };

    const resetAssessment = () => {
        const newState = {
            answers: {},
            currentQuestionId: QUESTIONS[0].id,
            isPremium: false,
            isComplete: false,
            showUpsell: false,
            userProfile: null
        };
        setState(newState);
        localStorage.setItem('trb_assessment_state', JSON.stringify(newState));
    };

    return (
        <AssessmentContext.Provider
            value={{
                ...state,
                setAnswer,
                nextQuestion,
                prevQuestion,
                setPremium,
                closeUpsell,
                completeAssessment,
                resetAssessment,
                setUserProfile,
                activeQuestions,
                currentQuestionIndex: safeIndex,
                totalQuestions: activeQuestions.length
            }}
        >
            {children}
        </AssessmentContext.Provider>
    );
}

export function useAssessment() {
    const context = useContext(AssessmentContext);
    if (context === undefined) {
        throw new Error('useAssessment must be used within an AssessmentProvider');
    }
    return context;
}
