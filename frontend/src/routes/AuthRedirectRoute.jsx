// src/routes/AuthRedirectRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../lib/api';

// 사용법: <AuthRedirectRoute Component={AdminLogin} />
export default function AuthRedirectRoute({ Component }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                await api.post('/api/auth/verify-token', {});
                if (alive) setIsAuthenticated(true);
            } catch {
                if (alive) setIsAuthenticated(false);
            }
        })();
        return () => { alive = false; };
    }, []);

    if (isAuthenticated === null) return null;               // 로딩 중
    return isAuthenticated ? <Navigate to="/admin/post" replace /> : <Component />;
}