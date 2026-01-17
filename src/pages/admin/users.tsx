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
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
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

            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#2D3748', fontFamily: 'serif' }}>User Management</h1>

            {/* User Table */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#F7FAFC', borderBottom: '2px solid #EDF2F7' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#718096' }}>Name</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#718096' }}>Email</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#718096' }}>Category</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#718096' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: '#718096' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</td></tr>
                        ) : users.map(user => (
                            <tr key={user.uid} style={{ borderBottom: '1px solid #EDF2F7' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold', color: '#2D3748' }}>{user.profile?.name || user.displayName || 'N/A'}</td>
                                <td style={{ padding: '1rem', color: '#4A5568' }}>{user.email}</td>
                                <td style={{ padding: '1rem', color: '#4A5568' }}>
                                    {user.profile?.category ? CATEGORY_LABELS[user.profile.category as keyof typeof CATEGORY_LABELS] : 'Unknown'}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {user.isPremium ?
                                        <span style={{ background: '#C6F6D5', color: '#22543D', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' }}>Premium</span> :
                                        <span style={{ background: '#EDF2F7', color: '#4A5568', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' }}>Free</span>
                                    }
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleViewUser(user)}
                                        style={{ padding: '0.5rem 1rem', background: '#3182CE', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
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
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
                    <div style={{ background: 'white', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '12px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontFamily: 'serif' }}>Assessment History for {selectedUser.profile?.name}</h2>
                            <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        {loadingAssessments ? (
                            <p>Loading assessments...</p>
                        ) : userAssessments.length === 0 ? (
                            <p>No assessments found for this user.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {userAssessments.map(assessment => (
                                    <div key={assessment.id} style={{ border: '1px solid #E2E8F0', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ fontWeight: 'bold', color: '#2D3748' }}>{assessment.archetype?.name || 'Incomplete Analysis'}</h3>
                                            <p style={{ fontSize: '0.9rem', color: '#718096' }}>
                                                {new Date(assessment.createdAt?.seconds * 1000).toLocaleString()}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button
                                                onClick={() => handleDownloadPDF(assessment, selectedUser.profile?.name || 'Candidate')}
                                                disabled={isGeneratingPdf}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: isGeneratingPdf ? '#CBD5E0' : '#38A169',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: isGeneratingPdf ? 'wait' : 'pointer'
                                                }}
                                            >
                                                {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
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
