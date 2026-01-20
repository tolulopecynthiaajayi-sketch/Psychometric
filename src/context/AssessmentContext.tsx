import React, { createContext, useContext, useEffect, useState } from 'react';
import { QUESTIONS, Question, UserProfile, PRICE_TIERS } from '@/config/assessment';
import { useAuth } from './AuthContext'; // Import Auth to track user changes

interface AssessmentState {
    answers: Record<string, number>;
    currentQuestionId: string;
    isPremium: boolean;
    isComplete: boolean;
    showUpsell: boolean;
    userProfile: UserProfile | null;
    ownerId?: string; // NEW: Track who owns this state
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
    const { user, loading: authLoading } = useAuth(); // Access current user

    const [state, setState] = useState<AssessmentState>({
        answers: {},
        currentQuestionId: QUESTIONS[0].id,
        isPremium: false,
        isComplete: false,
        showUpsell: false,
        userProfile: null,
        ownerId: undefined
    });

    // Safety flag to prevent overwriting LocalStorage before we've read it
    const [isLoaded, setIsLoaded] = useState(false);

    // Derived state: Get list of questions based on premium status
    const activeQuestions = React.useMemo(() => {
        if (state.isPremium) return QUESTIONS;
        return QUESTIONS.filter(q => q.isFreeTier);
    }, [state.isPremium]);

    const currentQuestionIndex = activeQuestions.findIndex(q => q.id === state.currentQuestionId);

    // Auto-recover if currentQuestionId is invalid (e.g. switching Free/Premium)
    useEffect(() => {
        if (currentQuestionIndex === -1 && activeQuestions.length > 0) {
            console.warn("Found invalid question ID, resetting to first question.");
            setState(prev => ({ ...prev, currentQuestionId: activeQuestions[0].id }));
        }
    }, [currentQuestionIndex, activeQuestions]);

    const safeIndex = currentQuestionIndex === -1 ? 0 : currentQuestionIndex;

    // 1. LOAD STATE & CHECK OWNER
    useEffect(() => {
        if (authLoading) return; // Wait for auth to settle

        const savedState = localStorage.getItem('trb_assessment_state');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);

                // CRITICAL SAFETY CHECK:
                // If a user is logged in, but the saved state belongs to someone else (or no one),
                // we MUST reset to prevent leaking previous user's data.
                if (user && parsed.ownerId && parsed.ownerId !== user.uid) {
                    console.log("AssessmentContext: Detected user mismatch (Saved:", parsed.ownerId, "| Current:", user.uid, "). Resetting state.");
                    // Don't load the old state. Just start fresh and tag with new ID.
                    setState(prev => ({ ...prev, ownerId: user.uid }));
                    setIsLoaded(true);
                    return;
                }

                if (typeof parsed.currentQuestionIndex === 'number' && !parsed.currentQuestionId) {
                    parsed.currentQuestionId = QUESTIONS[0].id;
                }

                setState({
                    ...parsed,
                    showUpsell: parsed.showUpsell || false,
                    userProfile: parsed.userProfile || null,
                    ownerId: parsed.ownerId || (user ? user.uid : undefined) // Adopt orphan state if valid
                });
            } catch (e) {
                console.error("Failed to parse saved state", e);
            }
        } else if (user) {
            // No saved state, but we have a user. Ensure state has their ID.
            setState(prev => ({ ...prev, ownerId: user.uid }));
        }

        setIsLoaded(true);
    }, [user, authLoading]);

    // 2. FORCE ID SYNC
    // If user logs in mid-session, tag the anonymous state with their ID
    useEffect(() => {
        if (user && state.ownerId !== user.uid && isLoaded) {
            console.log("AssessmentContext: Tagging anonymous state with User ID");
            setState(prev => ({ ...prev, ownerId: user.uid }));
        }
    }, [user, isLoaded, state.ownerId]);

    // 3. FIRESTORE SYNC (Real-time Premium Check)
    useEffect(() => {
        if (!user) return;
        let unsubscribe: () => void;

        import('firebase/firestore').then(({ doc, onSnapshot, getFirestore }) => {
            const db = getFirestore();
            unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
                const data = doc.data();
                // If Firebase says Premium, but Local says Free -> UPGRADE
                if (data?.isPremium === true) {
                    setState(prev => {
                        if (!prev.isPremium) {
                            console.log("🔥 FIRESTORE SYNC: Unlocking Premium Access");
                            return { ...prev, isPremium: true, showUpsell: false };
                        }
                        return prev;
                    });
                }
            });
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    // 3. PERSIST STATE
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('trb_assessment_state', JSON.stringify(state));
        }
    }, [state, isLoaded]);

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
        // SMART REWIND: Find the first unanswered question and jump there.
        setState((prev) => {
            let nextQ = prev.currentQuestionId;

            if (status === true) {
                // We access QUESTIONS directly from config because 'activeQuestions' in state 
                // might still be the old Free tier list during this update cycle.
                const firstUnanswered = QUESTIONS.find(q => !prev.answers[q.id]);
                if (firstUnanswered) {
                    console.log("Smart Rewind: Jumping to first unanswered question:", firstUnanswered.id);
                    nextQ = firstUnanswered.id;
                } else if (!QUESTIONS.find(q => q.id === prev.currentQuestionId)) {
                    // If current ID is somehow invalid (e.g. Free user on Q30, but Q30 is valid), 
                    // just safe reset to start if no gaps found.
                    nextQ = QUESTIONS[0].id;
                }
            }

            return {
                ...prev,
                isPremium: status,
                showUpsell: false,
                isComplete: false,
                currentQuestionId: nextQ
            };
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
