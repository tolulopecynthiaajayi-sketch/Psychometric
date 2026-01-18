import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { collection, query, getDocs, orderBy, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminLayout from '@/components/admin/AdminLayout';
import { ReportSlides } from '@/components/report/ReportSlides'; // Reuse existing slides
import { CATEGORY_LABELS } from '@/config/assessment';

// Types
interface AdminUser {
    uid: string;
    email: string;
    displayName: string;
    profile?: {
        name: string;
        category: string;
        organization?: string;
    };
    isPremium?: boolean;
    lastActive?: any;
}

interface AdminAssessment {
    id: string;
    createdAt: any;
    scores: any[];
    archetype?: { name: string };
    isPremium: boolean;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [userAssessments, setUserAssessments] = useState<AdminAssessment[]>([]);
    const [loadingAssessments, setLoadingAssessments] = useState(false);

    // PDF State
    const [pdfData, setPdfData] = useState<{ scores: any[], name: string, isPremium: boolean } | null>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        if (!db) return;
        try {
            const q = query(collection(db, 'users')); // Fetch all users (add pagination later if needed)
            const snapshot = await getDocs(q);
            const userList = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as AdminUser));
            setUsers(userList);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewUser = async (user: AdminUser) => {
        setSelectedUser(user);
        setLoadingAssessments(true);
        if (!db) return;

        try {
            const q = query(
                collection(db, 'assessments'),
                where('userId', '==', user.uid)
                // orderBy('createdAt', 'desc') // Checking if Index is missing
            );
            const snapshot = await getDocs(q);
            const assessments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminAssessment));
            setUserAssessments(assessments);
        } catch (error) {
            console.error("Error fetching assessments:", error);
        } finally {
            setLoadingAssessments(false);
        }
    };

    const handleDownloadPDF = async (assessment: AdminAssessment, userName: string) => {
        if (isGeneratingPdf) return;
        setIsGeneratingPdf(true);

        // 1. Set data to render the hidden report
        setPdfData({
            scores: assessment.scores,
            name: userName,
            isPremium: assessment.isPremium
        });

        // 2. Wait for render, then print
        setTimeout(async () => {
            try {
                const { generatePDFReport } = await import('@/utils/pdfGenerator');
                await generatePDFReport('admin-pdf-container'); // Special ID for admin
            } catch (error) {
                console.error("PDF Fail:", error);
                alert("Failed to generate PDF");
            } finally {
                setIsGeneratingPdf(false);
                setPdfData(null); // Clear after generation
            }
        }, 1000); // 1s buffer for React render
    };

    return (
        <AdminLayout>
            <Head>
                <title>Admin: Users | TRB Alchemy</title>
            </Head>

            <h1 className="text-gradient-warm" style={{ fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'serif' }}>User Management</h1>

            {/* User Table */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #FEEBC8' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#FFFAF0', borderBottom: '2px solid #F6AD55' }}>
                        <tr>
                            <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#C05621', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>Name</th>
                            <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#C05621', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>Email</th>
                            <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#C05621', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>Category</th>
                            <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#C05621', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>Status</th>
                            <th style={{ padding: '1.25rem 1rem', textAlign: 'right', color: '#C05621', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>Loading users...</td></tr>
                        ) : users.map(user => (
                            <tr key={user.uid} style={{ borderBottom: '1px solid #EDF2F7', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#FFFBEB'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                <td style={{ padding: '1.25rem 1rem', fontWeight: 'bold', color: '#2D3748' }}>{user.profile?.name || user.displayName || 'N/A'}</td>
                                <td style={{ padding: '1.25rem 1rem', color: '#4A5568' }}>{user.email}</td>
                                <td style={{ padding: '1.25rem 1rem', color: '#4A5568' }}>
                                    {user.profile?.category ? CATEGORY_LABELS[user.profile.category as keyof typeof CATEGORY_LABELS] : 'Unknown'}
                                </td>
                                <td style={{ padding: '1.25rem 1rem' }}>
                                    {user.isPremium ?
                                        <span style={{ background: '#C6F6D5', color: '#22543D', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #9AE6B4' }}>Premium</span> :
                                        <span style={{ background: '#EDF2F7', color: '#4A5568', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', border: '1px solid #E2E8F0' }}>Free</span>
                                    }
                                </td>
                                <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleViewUser(user)}
                                        style={{
                                            padding: '0.6rem 1.2rem',
                                            background: 'white',
                                            color: '#C05621',
                                            border: '1px solid #ED8936',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#ED8936'; e.currentTarget.style.color = 'white'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#C05621'; }}
                                    >
                                        View Results
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {selectedUser && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(26, 32, 44, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
                    <div className="fade-in-up" style={{ background: 'white', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.8rem', fontFamily: 'serif', color: '#2D3748', margin: 0 }}>
                                Assessment History
                                <span style={{ display: 'block', fontSize: '1rem', color: '#718096', marginTop: '0.5rem', fontFamily: 'sans-serif', fontWeight: 'normal' }}>
                                    for {selectedUser.profile?.name}
                                </span>
                            </h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                style={{ background: '#F7FAFC', border: 'none', fontSize: '1.5rem', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0AEC0', transition: 'all 0.2s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#FED7D7'; e.currentTarget.style.color = '#C53030'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#F7FAFC'; e.currentTarget.style.color = '#A0AEC0'; }}
                            >
                                ×
                            </button>
                        </div>

                        {loadingAssessments ? (
                            <p style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>Loading assessments...</p>
                        ) : userAssessments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', background: '#F7FAFC', borderRadius: '12px', border: '1px dashed #E2E8F0' }}>
                                <p style={{ color: '#718096' }}>No assessments found for this user.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {userAssessments.map(assessment => (
                                    <div key={assessment.id} style={{ background: '#FFFAF0', border: '1px solid #FEEBC8', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s' }}>
                                        <div>
                                            <h3 style={{ fontWeight: 'bold', color: '#C05621', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                                                {assessment.archetype?.name || 'Incomplete Analysis'}
                                            </h3>
                                            <p style={{ fontSize: '0.9rem', color: '#718096' }}>
                                                Created on {new Date(assessment.createdAt?.seconds * 1000).toLocaleDateString()} at {new Date(assessment.createdAt?.seconds * 1000).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button
                                                onClick={() => handleDownloadPDF(assessment, selectedUser.profile?.name || 'Candidate')}
                                                disabled={isGeneratingPdf}
                                                className="btn-primary-warm"
                                                style={{
                                                    padding: '0.6rem 1.2rem',
                                                    fontSize: '0.9rem',
                                                    opacity: isGeneratingPdf ? 0.7 : 1,
                                                    cursor: isGeneratingPdf ? 'wait' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                {isGeneratingPdf ? 'Generating...' : '📥 Download PDF'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Hidden PDF Container */}
            {pdfData && (
                <div id="admin-pdf-container">
                    <ReportSlides
                        scores={pdfData.scores}
                        candidateName={pdfData.name}
                        hasBookSessionAccess={true} /* Admin always sees upsell */
                    />
                </div>
            )}
        </AdminLayout>
    );
}
