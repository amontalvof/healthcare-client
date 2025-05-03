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

const dialogContentMap = {
    [AuthTypes.LOGIN]: [email, password],
    [AuthTypes.REGISTER]: [fullName, email, password],
    [AuthTypes.FORGOT_PASSWORD]: [email],
};

const resolveAuthDialogContent = (type: AuthTypes) => {
    return dialogContentMap[type] || dialogContentMap[AuthTypes.LOGIN];
};

export default resolveAuthDialogContent;
