import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { isAdmin } from '@/config/admin';
import { ReportSlides } from '@/components/report/ReportSlides';

export default function Dashboard() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [assessments, setAssessments] = useState<any[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);

    // PDF State
    const [pdfData, setPdfData] = useState<{ scores: any[], name: string, isPremium: boolean } | null>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            fetchAssessments();
        }
    }, [user, loading, router]);

    const fetchAssessments = async () => {
        if (!user || !db) return;
        try {
            const q = query(
                collection(db, 'assessments'),
                where('userId', '==', user.uid)
                // orderBy('createdAt', 'desc') // Checking if Index is missing
            );
            const querySnapshot = await getDocs(q);
            const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAssessments(results);
        } catch (error) {
            console.error("Error fetching assessments:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleDownloadPDF = async (assessment: any) => {
        if (isGeneratingPdf) return;
        setIsGeneratingPdf(true);

        // 1. Set data to render the hidden report
        setPdfData({
            scores: assessment.scores,
            name: user?.displayName || user?.email?.split('@')[0] || 'Valued User',
            isPremium: assessment.isPremium
        });

        // 2. Wait for render, then print
        setTimeout(async () => {
            try {
                const { generatePDFReport } = await import('@/utils/pdfGenerator');
                await generatePDFReport('user-pdf-container', user?.displayName || 'My_Report');
            } catch (error) {
                console.error("PDF Fail:", error);
                alert("Failed to generate PDF");
            } finally {
                setIsGeneratingPdf(false);
                setPdfData(null); // Clear after generation
            }
        }, 1000); // 1s buffer for React render
    };

    if (loading || (fetchLoading && user)) {
        return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    }

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', background: '#F7FAFC', padding: '2rem' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header className="dashboard-header">
                    <h1 style={{ fontFamily: 'serif', fontSize: '2rem', color: '#2D3748' }}>Dashboard</h1>
                    <div className="dashboard-actions">
                        <span className="user-email">{user.email}</span>
                        {isAdmin(user.email) && (
                            <Link href="/admin" className="btn-admin">
                                Admin Panel
                            </Link>
                        )}
                        <button onClick={logout} className="btn-logout">Logout</button>
                        <Link href="/" className="btn-new">New Assessment</Link>
                    </div>
                </header>

                <style jsx>{`
                    .dashboard-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 3rem;
                    }
                    .dashboard-actions {
                        display: flex;
                        gap: 1rem;
                        align-items: center;
                    }
                    .user-email {
                        color: #718096;
                    }
                    .btn-admin {
                        padding: 0.5rem 1rem;
                        background: #2D3748;
                        color: white;
                        border-radius: 6px;
                        text-decoration: none;
                        font-weight: bold;
                    }
                    .btn-logout {
                        padding: 0.5rem 1rem;
                        background: white;
                        border: 1px solid #CBD5E0;
                        border-radius: 6px;
                        cursor: pointer;
                    }
                    .btn-new {
                        padding: 0.5rem 1rem;
                        background: #DD6B20;
                        color: white;
                        border-radius: 6px;
                        text-decoration: none;
                        font-weight: bold;
                    }

                    @media (max-width: 768px) {
                        .dashboard-header {
                            flex-direction: column;
                            align-items: flex-start;
                            padding-top: 2rem; /* Add top padding on mobile */
                            gap: 1.5rem;
                        }
                        .dashboard-actions {
                            flex-wrap: wrap; /* allow wrapping if email is long */
                            width: 100%;
                            justify-content: space-between;
                        }
                        .user-email {
                            width: 100%; /* force new line for buttons */
                            margin-bottom: 0.5rem;
                            font-size: 0.9rem;
                        }
                        .btn-admin, .btn-logout, .btn-new {
                            font-size: 0.9rem;
                            padding: 0.4rem 0.8rem;
                        }
                    }
                `}</style>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#4A5568' }}>Your Reports</h2>

                {assessments.length === 0 ? (
                    <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', textAlign: 'center', color: '#718096' }}>
                        <p>You haven't completed any assessments yet.</p>
                        <Link href="/onboarding" style={{ display: 'inline-block', marginTop: '1rem', color: '#DD6B20', fontWeight: 'bold' }}>Start Your First Assessment →</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {assessments.map((assessment: any) => (
                            <div key={assessment.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2D3748', marginBottom: '0.5rem' }}>
                                        {assessment.archetype?.name || 'Professional Profile'}
                                    </h3>
                                    <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                                        Completed on {new Date(assessment.createdAt?.seconds * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    {/* In a real app, this would open the detailed view or regenerate PDF */}
                                    <span style={{ background: '#EBF8FF', color: '#3182CE', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginRight: '1rem' }}>
                                        {assessment.isPremium ? 'Premium Report' : 'Free Report'}
                                    </span>

                                    {assessment.isPremium && (
                                        <button
                                            onClick={() => handleDownloadPDF(assessment)}
                                            disabled={isGeneratingPdf}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: isGeneratingPdf ? '#CBD5E0' : '#38A169',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: isGeneratingPdf ? 'wait' : 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hidden PDF Container */}
            {pdfData && (
                <div id="user-pdf-container">
                    <ReportSlides
                        scores={pdfData.scores}
                        candidateName={pdfData.name}
                        hasBookSessionAccess={true}
                    />
                </div>
            )}
        </div>
    );
}
