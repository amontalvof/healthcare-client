import { IUserAuth } from '@/types/AuthDialog';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload extends IUserAuth {
    exp: number;
}

const resolveUserInfo = (token: string | null) => {
    if (!token) {
        return null;
    }
    const { _id, fullName, image, email, roles } = jwtDecode<JWTPayload>(token);
    return { _id, fullName, image, email, roles };
};

export default resolveUserInfo;
