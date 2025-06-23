import { useAuthCredentials } from '@/zustand/auth';
import { Navigate, Outlet } from 'react-router-dom';

export function PrivateRoute() {
    const token = useAuthCredentials((s) => s.accessToken);
    if (!token) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}
