import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isAdmin } from '@/config/admin';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (!isAdmin(user.email)) {
                router.push('/dashboard'); // Not an admin
            } else {
                setAuthorized(true);
            }
        }
    }, [user, loading, router]);

    if (loading || !authorized) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Verifying Admin Access...</p>
            </div>
        );
    }

    return <>{children}</>;
}
