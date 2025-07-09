import parsePhoneNumber from 'libphonenumber-js';
import { z } from 'zod';

const phoneNumberValidator = (value: string, ctx: z.RefinementCtx) => {
    const phoneNumber = parsePhoneNumber(value, {
        defaultCountry: 'US',
    });
    if (!phoneNumber?.isValid()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid phone number',
        });
        return z.NEVER;
    }
    return phoneNumber.formatNational();
};

export default phoneNumberValidator;
