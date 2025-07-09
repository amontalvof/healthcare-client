import { useAuthCredentials } from '@/context/auth';
import { useRedirect } from '@/context/redirect';
import { ApiError } from '@/types/Api';
import { toast } from 'sonner';

export const fetchWithoutToken = async <T>(
    endpoint: string,
    data?: T,
    method = 'GET'
) => {
    const url = `${import.meta.env.VITE_BACKEND_API_URL}${endpoint}`;
    let res;
    if (method === 'GET') {
        res = await fetch(url);
    } else {
        res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    }
    const payload = await res.json();
    if (!res.ok) {
        throw new Error(
            (payload as unknown as ApiError).message || `Error ${res.status}`
        );
    }
    return payload;
};

export const fetchWithToken = async <T>(
    endpoint: string,
    data?: T,
    method = 'GET'
) => {
    const url = `${import.meta.env.VITE_BACKEND_API_URL}${endpoint}`;
    const { accessToken, clearCredentials } = useAuthCredentials.getState();
    let res;
    if (method === 'GET') {
        res = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } else {
        res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        });
    }
    const payload = await res.json();
    if (res.status === 401) {
        clearCredentials();
        toast('Session expired. Please log in again.');
        useRedirect.getState().setTo('/');
        throw new Error('Unauthorized');
    }
    if (!res.ok) {
        throw new Error(
            (payload as unknown as ApiError).message || `Error ${res.status}`
        );
    }
    return payload;
};
