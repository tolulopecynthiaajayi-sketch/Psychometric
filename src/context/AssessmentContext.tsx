import React, { createContext, useContext, useEffect, useState } from 'react';
import { QUESTIONS } from '@/config/assessment';

interface AssessmentState {
    answers: Record<string, number>; // questionId -> score (1-5)
    currentQuestionIndex: number;
    isPremium: boolean;
    isComplete: boolean;
    showUpsell: boolean;
}

interface AssessmentContextType extends AssessmentState {
    setAnswer: (questionId: string, value: number) => void;
    nextQuestion: () => void;
    prevQuestion: () => void;
    setPremium: (status: boolean) => void;
    closeUpsell: () => void;
    completeAssessment: () => void;
    resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AssessmentState>({
        answers: {},
        currentQuestionIndex: 0,
        isPremium: false,
        isComplete: false,
        showUpsell: false,
    });

    // Load state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('trb_assessment_state');
        if (savedState) {
            // Ensure strict type safety when loading potentially old state
            const parsed = JSON.parse(savedState);
            setState({
                ...parsed,
                showUpsell: parsed.showUpsell || false // Default if missing
            });
        }
    }, []);

    // Save state to localStorage on change
    useEffect(() => {
        localStorage.setItem('trb_assessment_state', JSON.stringify(state));
    }, [state]);

    const setAnswer = (questionId: string, value: number) => {
        setState((prev) => ({
            ...prev,
            answers: { ...prev.answers, [questionId]: value },
        }));
    };

    const nextQuestion = () => {
        setState((prev) => {
            // Freemium Gate: Stop at question 12 if not premium
            if (!prev.isPremium && prev.currentQuestionIndex >= 11) {
                return { ...prev, showUpsell: true };
            }
            return { ...prev, currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, QUESTIONS.length - 1) };
        });
    };

    const prevQuestion = () => {
        setState((prev) => ({
            ...prev,
            currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
        }));
    };

    const setPremium = (status: boolean) => {
        setState((prev) => ({ ...prev, isPremium: status, showUpsell: false }));
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
            currentQuestionIndex: 0,
            isPremium: false,
            isComplete: false,
            showUpsell: false,
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
