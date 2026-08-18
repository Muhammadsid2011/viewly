import React, { useEffect } from 'react';
import { getCurrentUser } from '../api/auth';
import useAuthStore from '../store/authStore';

function AuthProvider({ children }) {

    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await getCurrentUser();
                const user = response.data;
                setUser(user);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchCurrentUser();
    },[]);

    return children
}

export default AuthProvider
