import { AuthTypes } from '@/constants';

interface AuthDialogInfo {
    dialogTitle: string;
    dialogDescription: string;
    dialogButtonText: string;
    defaultValues: Record<string, unknown>;
}

const dialogInfoMap: Partial<Record<AuthTypes, AuthDialogInfo>> = {
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

const resolveAuthDialogInfo = (
    type: Exclude<AuthTypes, 'resend-code'>
): AuthDialogInfo => {
    return dialogInfoMap[type] ?? dialogInfoMap[AuthTypes.LOGIN]!;
};

export default resolveAuthDialogInfo;
