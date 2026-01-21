import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { QUESTIONS, Question, UserProfile, PRICE_TIERS, getArchetype } from '@/config/assessment';
import { collection, addDoc, serverTimestamp, doc, setDoc, getFirestore } from 'firebase/firestore';
import { useAuth } from './AuthContext'; // Import Auth to track user changes

interface AssessmentState {
    answers: Record<string, number>;
    currentQuestionId: string;
    isPremium: boolean;
    isComplete: boolean;
    isSaved: boolean;
    assessmentId?: string; // NEW: Track the document ID for updates/deduplcation
    showUpsell: boolean;
    userProfile: UserProfile | null;
    ownerId?: string;
}

interface AssessmentContextType extends AssessmentState {
    setAnswer: (questionId: string, value: number) => void;
    nextQuestion: () => void;
    prevQuestion: () => void;
    setPremium: (status: boolean) => void;
    markAsSaved: (id?: string) => void; // Update signature
    closeUpsell: () => void;
    completeAssessment: () => void;
    resetAssessment: () => void;
    saveAssessment: (scores: any[]) => Promise<void>; // New exposed method
    setUserProfile: (profile: UserProfile) => void;
    activeQuestions: Question[];
    currentQuestionIndex: number;
    totalQuestions: number;
    isLoaded: boolean; // Sync flag
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth(); // Access current user

    const [state, setState] = useState<AssessmentState>({
        answers: {},
        currentQuestionId: QUESTIONS[0].id,
        isPremium: false,
        isComplete: false,
        isSaved: false,
        assessmentId: undefined,
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
                    isSaved: parsed.isSaved || false,
                    assessmentId: parsed.assessmentId || undefined, // Restore ID
                    showUpsell: parsed.showUpsell || false,
                    userProfile: parsed.userProfile || null,
                    ownerId: parsed.ownerId || (user ? user.uid : undefined)
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
                isSaved: false, // Force re-save on upgrade so we can update the doc
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

    const markAsSaved = (id?: string) => {
        setState((prev) => ({
            ...prev,
            isSaved: true,
            assessmentId: id || prev.assessmentId
        }));
    };

    const resetAssessment = () => {
        const newState = {
            answers: {},
            currentQuestionId: QUESTIONS[0].id,
            isPremium: false,
            isComplete: false,
            isSaved: false,
            assessmentId: undefined, // Reset
            showUpsell: false,
            userProfile: null
        };
        setState(newState);
        localStorage.setItem('trb_assessment_state', JSON.stringify(newState));
        setState(newState);
        localStorage.setItem('trb_assessment_state', JSON.stringify(newState));
    };

    // MUTEX LOCK for saving
    const isSavingRef = useRef(false);

    const saveAssessment = async (scores: any[]) => {
        // 1. Double check locks and auth
        if (isSavingRef.current || !user || !isLoaded) {
            console.warn("Save skipped: Locked or not loaded.");
            return;
        }

        // 2. Double check state (prevent saving initialized/empty states)
        if (state.isSaved && state.assessmentId && !state.isPremium) {
            // Allow RE-SAVE if we are Premium (upgrading), otherwise skip
            // But actually, setPremium resets isSaved to false, so this check passes.
            console.log("Save skipped: Already saved.");
            return;
        }

        try {
            isSavingRef.current = true; // LOCK
            console.log("🔐 Context: Starting Secure Save...", state.assessmentId ? `(Updating ${state.assessmentId})` : "(New)");

            // Lazy load DB if not already available? We used getFirestore above? 
            // Better to use imported db from lib/firebase but we can use the SDK function too.
            // Let's use the one from lib/firebase if possible, or just standard SDK.
            // I'll stick to standard SDK for the context to avoid circular dep issues if possible, 
            // but importing `db` from `@/lib/firebase` is safer for initialized instance.
            // Actually, I'll dynamic import to be safe OR just use the hook's db.
            // Let's use standard import.
            const { db } = await import('@/lib/firebase');
            if (!db) throw new Error("Firebase not initialized");

            const archetype = getArchetype(scores);
            const assessmentData = {
                userId: user.uid,
                userEmail: user.email,
                profile: state.userProfile,
                scores: scores,
                archetype: archetype,
                isPremium: state.isPremium,
                createdAt: serverTimestamp(),
                answers: state.answers
            };

            let newId = state.assessmentId;

            if (state.assessmentId) {
                // UPDATE
                await setDoc(doc(db, 'assessments', state.assessmentId), assessmentData, { merge: true });
            } else {
                // CREATE
                const docRef = await addDoc(collection(db, 'assessments'), assessmentData);
                newId = docRef.id;
            }

            // Update User Profile
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: state.userProfile?.name || '',
                profile: state.userProfile,
                updatedAt: serverTimestamp(),
                isPremium: state.isPremium || false
            }, { merge: true });

            console.log("✅ Context: Save Complete!");

            // Update State with new ID and Saved Status
            markAsSaved(newId);

        } catch (err) {
            console.error("❌ Save Failed:", err);
        } finally {
            isSavingRef.current = false; // UNLOCK
        }
    };

    return (
        <AssessmentContext.Provider
            value={{
                ...state,
                setAnswer,
                nextQuestion,
                prevQuestion,
                setPremium,
                markAsSaved, // Expose
                closeUpsell,
                completeAssessment,
                resetAssessment,
                saveAssessment, // Expose
                setUserProfile,
                activeQuestions,
                currentQuestionIndex: safeIndex,
                totalQuestions: activeQuestions.length,
                isLoaded
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
