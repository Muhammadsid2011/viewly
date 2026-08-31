import { useEffect } from 'react';
import { getCurrentUser } from '../api/auth';
import useAuthStore from '../store/authStore';
import { getToken, clearToken } from '../api/axios';

function AuthProvider({ children }) {
    const setUser = useAuthStore((state) => state.setUser);
    const setAuthLoading = useAuthStore((state) => state.setAuthLoading);

    useEffect(() => {
        const bootstrap = async () => {
            if (!getToken()) {
                setAuthLoading(false);
                return;
            }
            try {
                const response = await getCurrentUser();
                setUser(response.data);
            } catch {
                // Token missing/expired/invalid — the interceptor already cleared it.
                clearToken();
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        bootstrap();
    }, [setUser, setAuthLoading]);

    return children;
}

export default AuthProvider;
