import { AuthTypes } from '@/constants';
import { z } from 'zod';

const fullName = z
    .string()
    .min(4, { message: 'Password must be at least 4 characters.' })
    .max(50, { message: 'Password must not exceed 50 characters.' });
const email = z.string().email();
const password = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(50, { message: 'Password must not exceed 50 characters.' })
    .regex(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'The password must have an uppercase letter, a lowercase letter, and a number.',
    });

const dialogSchemasMap = {
    [AuthTypes.LOGIN]: z.object({
        email,
        password,
    }),
    [AuthTypes.REGISTER]: z.object({ fullName, email, password }),
    [AuthTypes.FORGOT_PASSWORD]: z.object({ email }),
    [AuthTypes.VERIFY_ACCOUNT]: z.object({
        email,
        verificationCode: z
            .string()
            .min(6, {
                message: 'Verification code must be at least 6 characters.',
            })
            .max(6),
    }),
    [AuthTypes.RESEND_CODE]: z.object({
        email,
    }),
};

const resolveAuthDialogSchemas = (type: AuthTypes) => {
    return dialogSchemasMap[type] || dialogSchemasMap[AuthTypes.LOGIN];
};

export default resolveAuthDialogSchemas;
