import { AsYouType } from 'libphonenumber-js';

const formatPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.length > 4
        ? new AsYouType('US').input(phoneNumber)
        : phoneNumber;
};

export default formatPhoneNumber;
