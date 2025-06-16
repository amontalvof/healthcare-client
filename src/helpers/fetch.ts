import { ApiError } from '@/types/Api';

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
    const token = localStorage.getItem('token') ?? '';
    let res;
    if (method === 'GET') {
        res = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } else {
        res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
    }
    const payload = (await res.json()) as unknown as ApiError;
    if (!res.ok) {
        throw new Error(
            (payload as unknown as ApiError).message || `Error ${res.status}`
        );
    }
    return payload;
};
