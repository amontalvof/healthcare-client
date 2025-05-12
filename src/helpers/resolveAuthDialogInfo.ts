import { AuthTypes } from '@/constants';

const dialogInfoMap = {
    [AuthTypes.LOGIN]: {
        dialogTitle: 'Login to your account',
        dialogDescription: 'Enter your email and password to login',
        dialogButtonText: 'Login',
        defaultValues: {
            email: '',
            password: '',
        },
    },
    [AuthTypes.REGISTER]: {
        dialogTitle: 'Create an account',
        dialogDescription:
            'Enter your full name, email and password to create an account',
        dialogButtonText: 'Register',
        defaultValues: {
            email: '',
            password: '',
            fullName: '',
        },
    },
    [AuthTypes.FORGOT_PASSWORD]: {
        dialogTitle: 'Forgot password',
        dialogDescription: 'Enter your email to reset your password',
        dialogButtonText: 'Reset password',
        defaultValues: {
            email: '',
        },
    },
    [AuthTypes.VERIFY_ACCOUNT]: {
        dialogTitle: 'Verify your account',
        dialogDescription:
            'Enter the verification code sent to your email to verify your account',
        dialogButtonText: 'Verify',
        defaultValues: {
            verificationCode: '',
        },
    },
};

const resolveAuthDialogInfo = (type: AuthTypes) => {
    return dialogInfoMap[type] || dialogInfoMap[AuthTypes.LOGIN];
};

export default resolveAuthDialogInfo;
