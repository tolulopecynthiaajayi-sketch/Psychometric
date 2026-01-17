import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import AdminGuard from './AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { logout } = useAuth();
    const router = useRouter();

    const isActive = (path: string) => router.pathname === path;

    return (
        <AdminGuard>
            <div style={{ display: 'flex', minHeight: '100vh', background: '#F7FAFC' }}>
                {/* Sidebar */}
                <aside style={{ width: '250px', background: '#2D3748', color: 'white', padding: '2rem' }}>
                    <div style={{ marginBottom: '3rem' }}>
                        <h1 style={{ fontFamily: 'serif', fontSize: '1.5rem', marginBottom: '0.5rem' }}>TRB Admin</h1>
                        <p style={{ fontSize: '0.8rem', color: '#A0AEC0' }}>Control Center</p>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link href="/admin/users" style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            background: isActive('/admin/users') ? '#4A5568' : 'transparent',
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: isActive('/admin/users') ? 'bold' : 'normal',
                            display: 'block'
                        }}>
                            Users & Reports
                        </Link>
                        {/* Future links can go here */}
                    </nav>

                    <div style={{ marginTop: 'auto', paddingTop: '3rem' }}>
                        <button
                            onClick={logout}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: '#E53E3E',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </AdminGuard>
    );
}
