import { AuthTypes } from '@/constants';
import { fetchWithoutToken } from '@/helpers';

export const authQueries = async (type: AuthTypes, data: Object) => {
    switch (type) {
        case 'register':
            return fetchWithoutToken(
                '/auth/register',
                { ...data, role: 'patient' },
                'POST'
            );
        case 'login':
            return fetchWithoutToken('/auth/login', data, 'POST');
        case 'verify-account':
            return fetchWithoutToken('/auth/verify', data, 'POST');
        case 'resend-code':
            return fetchWithoutToken('/auth/resend', data, 'POST');
        default:
            return null;
    }
};
