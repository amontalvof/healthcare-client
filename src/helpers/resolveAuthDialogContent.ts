import { AuthTypes } from '@/constants';

const fullName = {
    type: 'text',
    name: 'fullName',
    label: 'Full Name',
    placeholder: 'Enter your full name',
};
const email = {
    type: 'email',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
};
const password = {
    type: 'password',
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
};

const verificationCode = {
    type: 'text',
    name: 'verificationCode',
    label: 'Verification Code',
    placeholder: '',
};

const dialogContentMap = {
    [AuthTypes.LOGIN]: [email, password],
    [AuthTypes.REGISTER]: [fullName, email, password],
    [AuthTypes.FORGOT_PASSWORD]: [email],
    [AuthTypes.VERIFY_ACCOUNT]: [verificationCode],
};

const resolveAuthDialogContent = (
    type: Exclude<AuthTypes, AuthTypes.RESEND_CODE>
) => {
    return dialogContentMap[type] || dialogContentMap[AuthTypes.LOGIN];
};

export default resolveAuthDialogContent;
