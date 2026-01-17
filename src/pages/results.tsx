import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAssessment } from '@/context/AssessmentContext';
import { DIMENSIONS, QUESTIONS, PRICE_TIERS, CATEGORY_LABELS, getArchetype } from '@/config/assessment';
import { RadarChart } from '@/components/charts/RadarChart';
// REMOVED STATIC IMPORT: import { generatePDFReport } from '@/utils/pdfGenerator';
import { ReportSlides } from '@/components/report/ReportSlides';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function ResultsPage() {
    const router = useRouter();
    const { answers, isPremium, userProfile, setPremium, completeAssessment, isComplete } = useAssessment();
    const { user } = useAuth();
    const [scores, setScores] = useState<{ label: string; value: number; fullMark: number }[]>([]);
    const [price, setPrice] = useState(0); // Default to 0 to prevent accidental premium logic
    const [saved, setSaved] = useState(false);
    const [isMounted, setIsMounted] = useState(false); // Safety check for client-side rendering
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    // Determine Status
    const isExempt = userProfile?.category === 'student' || userProfile?.category === 'job_seeker';
    const showFullReport = isPremium || isExempt;
    const archetype = getArchetype(scores);

    useEffect(() => {
        setIsMounted(true);
        // NUCLEAR OPTION FIX: Auto-complete assessment on arrival
        // ONLY if user is NOT premium. If they are premium, they might be here mid-upgrade,
        // so we must NOT force completion, otherwise they can't go back to answer the rest.
        if (!isComplete && Object.keys(answers).length > 0 && !isPremium) {
            completeAssessment();
        }
    }, [isComplete, answers, completeAssessment, isPremium]);

    useEffect(() => {
        if (userProfile?.category) {
            setPrice(PRICE_TIERS[userProfile.category]);
        }
    }, [userProfile]);

    useEffect(() => {
        // Calculate scores
        const calculatedScores = DIMENSIONS.map(dim => {
            const dimQuestions = QUESTIONS.filter(q => q.dimension === dim.key);
            const sum = dimQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
            return {
                label: dim.label,
                value: sum,
                fullMark: 25
            };
        });
        setScores(calculatedScores);
    }, [answers]);

    // Auto-save when scores, profile, and user are ready + user is premium/exempt
    useEffect(() => {
        if (showFullReport && user && scores.length > 0 && !saved) {
            // LITE MODE: Re-enabled for production data safety
            saveResultToFirebase();
            // console.log("Lite Mode: Auto-save skipped to ensure performance.");
        }
    }, [showFullReport, user, scores, saved]);

    const saveResultToFirebase = async () => {
        if (!user || saved || !db) return;
        try {
            // 1. Save Assessment Result
            const archetype = getArchetype(scores);
            await addDoc(collection(db, 'assessments'), {
                userId: user.uid,
                userEmail: user.email,
                profile: userProfile,
                scores: scores,
                archetype: archetype,
                isPremium: showFullReport,
                createdAt: serverTimestamp(),
                answers: answers // Optional: Save raw answers too
            });

            // 2. Save/Update User Profile in 'users' collection
            // This creates a clean directory of all users
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: userProfile?.name || '',
                profile: userProfile,
                updatedAt: serverTimestamp(),
                // If they are premium, mark it here too
                isPremium: showFullReport || false
            }, { merge: true });

            setSaved(true);
            console.log("Assessment AND User Profile saved to Firebase!");
            setSaved(true);
            console.log("Assessment saved to Firebase!");
        } catch (err) {
            console.error("Error saving assessment:", err);
        }
    };

    const handleUnlock = async () => {
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: price,
                    description: `Professional Profile (${CATEGORY_LABELS[userProfile?.category || 'senior_mgmt']})`
                })
            });
            const data = await res.json();

            // Handle Mock Success immediately for dev/demo if needed
            if (data.mock) {
                setPremium(true);
                // Redirect to assessment to finish questions
                // Use window.location to ensure fresh state load if needed, but router is faster
                router.push('/assessment');
            } else if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout failed', error);
        }
    };

    const handleDownloadPDF = async () => {
        if (isGeneratingPdf) return;
        setIsGeneratingPdf(true);
        try {
            // Lazy load the PDF generator only when requested
            const { generatePDFReport } = await import('@/utils/pdfGenerator');
            await generatePDFReport('pdf-report-container');
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Could not generate PDF. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (!isMounted) return null; // Prevent hydration mismatch and heavy initial load

    return (
        <>
            <Head>
                <title>Your Profile | TRB Alchemy™️</title>
            </Head>
            <main style={{ padding: '6rem 1rem', minHeight: '100vh', background: 'var(--bg-warm)' }}>
                <div className="container" style={{ maxWidth: '1000px', paddingBottom: '4rem' }}>

                    {/* Header Section */}
                    <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
                        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-dark-blue)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <img src="/images/logo-orange-nobg.png" alt="TRB Alchemy" style={{ width: '120px', filter: 'drop-shadow(0 4px 6px rgba(237, 137, 54, 0.2))' }} />
                            {showFullReport ? 'Your Alchemy Profile' : 'Preliminary Profile'}
                        </h1>
                        <p style={{ color: 'var(--color-gray-800)', fontSize: '1.2rem', marginTop: '1rem' }}>
                            {getArchetype(scores).name}
                        </p>
                    </div>

                    {/* Executive Summary Card */}
                    <div className="fade-in-up" style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '20px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                        marginBottom: '3rem',
                        border: '1px solid rgba(255,255,255,0.5)'
                    }}>
                        <h2 style={{ color: 'var(--color-burnt-orange)', borderBottom: '2px solid var(--color-gold-light)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                            ✨ Executive Summary
                        </h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#4A5568' }}>
                            {archetype.description}
                        </p>
                    </div>

                    {/* Results Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

                        {/* Chart Card */}
                        <div className="fade-in-up" style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '20px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            animationDelay: '0.1s'
                        }}>
                            <h3 style={{ color: 'var(--color-dark-blue)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Visual Profile</h3>
                            <div style={{ transform: 'scale(1.1)' }}>
                                <RadarChart data={scores} size={300} />
                            </div>
                            {!showFullReport && (
                                <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--color-gray-800)', fontSize: '0.9rem' }}>
                                    *Scores based on partial assessment
                                </p>
                            )}
                        </div>

                        {/* Dimensions List Card */}
                        <div className="fade-in-up" style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '20px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                            animationDelay: '0.2s'
                        }}>
                            <h3 style={{ color: 'var(--color-dark-blue)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Key Dimensions</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {scores.map((s, i) => (
                                    <li key={i} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-gray-100)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <strong style={{ color: 'var(--color-gray-800)' }}>{s.label}</strong>
                                            <span style={{ fontWeight: 'bold', color: s.value >= 21 ? '#38A169' : s.value >= 15 ? '#3182CE' : '#D69E2E' }}>
                                                {s.value}/25
                                            </span>
                                        </div>
                                        <div style={{ height: '6px', background: 'var(--color-gray-100)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', background: 'linear-gradient(90deg, #F6AD55 0%, #C05621 100%)', width: `${(s.value / 25) * 100}%`, borderRadius: '3px' }} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ACTION SECTION: Unlock or Upsell */}
                    {!showFullReport ? (
                        /* UPGRADE CTA */
                        <div className="fade-in-up" style={{
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #FFF5F5 0%, #FEFCBF 100%)',
                            padding: '3rem',
                            borderRadius: '20px',
                            border: '1px solid var(--color-gold)',
                            animationDelay: '0.3s'
                        }}>
                            <h3 style={{ fontSize: '1.8rem', color: '#C05621', marginBottom: '1rem' }}>Go Deeper with TRB Alchemy™️</h3>
                            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#4A5568', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                                You have your raw scores. Now unlock the <strong>Meaning</strong>. <br />
                                Upgrade to receive your custom <strong>Archetype Profile</strong>, deep-dive analysis, and a personalized <strong>90-Day Strategy Roadmap</strong>.
                            </p>
                            <button
                                onClick={handleUnlock}
                                className="btn-primary-warm"
                                style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}
                            >
                                Unlock Full Report (${price / 100})
                            </button>
                        </div>
                    ) : (
                        /* FULL REPORT ACTIONS */
                        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                            <div className="fade-in-up" style={{ padding: '2rem', background: '#F0FFF4', borderRadius: '20px', border: '1px solid #C6F6D5', marginBottom: '3rem', animationDelay: '0.3s' }}>
                                <h3 style={{ color: '#22543D', marginBottom: '1rem' }}>Your Full Report is Ready</h3>
                                <p style={{ marginBottom: '1.5rem', color: '#2F855A' }}>
                                    A comprehensive 15-page PDF detailing your archetype logic, blind spots, and a 90-day execution roadmap.
                                </p>
                                <button
                                    onClick={handleDownloadPDF}
                                    disabled={isGeneratingPdf}
                                    style={{
                                        padding: '1rem 2rem',
                                        background: isGeneratingPdf ? '#A0AEC0' : '#38A169',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50px',
                                        fontSize: '1rem',
                                        cursor: isGeneratingPdf ? 'wait' : 'pointer',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 12px rgba(56, 161, 105, 0.4)'
                                    }}
                                >
                                    {isGeneratingPdf ? 'Generating PDF...' : '📥 Download Full Report (PDF)'}
                                </button>
                            </div>

                            {/* Booking Upsell */}
                            {price >= 4900 ? (
                                /* Free Call for VIPs */
                                <div className="fade-in-up" style={{
                                    background: 'linear-gradient(135deg, #FFF5F5 0%, #FEFCBF 100%)',
                                    padding: '3rem',
                                    borderRadius: '20px',
                                    textAlign: 'center',
                                    border: '1px solid var(--color-gold-light)',
                                    animationDelay: '0.4s'
                                }}>
                                    <h3 style={{ color: 'var(--color-burnt-orange)', fontSize: '1.8rem', marginBottom: '1rem' }}>🌟 VIP Strategy Session Included</h3>
                                    <p style={{ maxWidth: '600px', margin: '0 auto 2rem', color: '#4A5568' }}>
                                        Since you purchased the full package, you are entitled to a complimentary 30-minute strategy call with Temitope.
                                    </p>
                                    <button
                                        onClick={() => window.location.href = "mailto:temitoperichardbanji@gmail.com?subject=Booking%20My%20Free%20Strategy%20Session&body=Hi%20Temitope%2C%0A%0AI%20have%20completed%20my%20assessment%20and%20qualified%20for%20the%20free%20strategy%20session.%20Please%20find%20my%20proof%20of%20payment%20attached."}
                                        className="btn-primary-warm"
                                        style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}
                                    >
                                        Email to Redeem Free Session
                                    </button>
                                </div>
                            ) : (
                                /* Paid Upsell */
                                <div className="fade-in-up" style={{
                                    background: 'white',
                                    padding: '3rem 2rem',
                                    borderRadius: '20px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                                    maxWidth: '700px',
                                    margin: '0 auto',
                                    textAlign: 'center',
                                    border: '1px solid var(--color-bg-warm)',
                                    animationDelay: '0.4s'
                                }}>
                                    <h3 style={{ fontSize: '1.6rem', color: 'var(--color-dark-blue)', marginBottom: '1rem' }}>Need personalized guidance?</h3>
                                    <p style={{ color: '#4A5568', marginBottom: '2rem', fontSize: '1.1rem' }}>
                                        Turn these insights into immediate career momentum with a 1-on-1 executive coaching session.
                                    </p>
                                    <ul style={{ textAlign: 'left', marginBottom: '2rem', color: '#4A5568', display: 'inline-block', fontSize: '1.1rem' }}>
                                        <li style={{ marginBottom: '0.8rem' }}>🔍 Deep-dive into your blind spots</li>
                                        <li style={{ marginBottom: '0.8rem' }}>🚀 Build a custom promotion strategy</li>
                                        <li>💡 Expert answers to your specific challenges</li>
                                    </ul>
                                    <br />
                                    <button
                                        onClick={() => window.location.href = "mailto:temitoperichardbanji@gmail.com?subject=Inquiry%3A%20Executive%20Coaching%20Session&body=Hi%20Temitope%2C%0A%0AI%20completed%20my%20assessment%20and%20would%20like%20to%20book%20a%20paid%20executive%20coaching%20session."}
                                        className="btn-primary-warm"
                                        style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}
                                    >
                                        Email to Book Session
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Hidden Slides for PDF Generation - DEFERRED RENDERING */}
                    {isMounted && showFullReport && scores.length > 0 && (
                        <ReportSlides
                            scores={scores}
                            hasBookSessionAccess={price >= 4900}
                            candidateName={userProfile?.name || 'Candidate'}
                        />
                    )}

                </div>
            </main>
        </>
    );
}
