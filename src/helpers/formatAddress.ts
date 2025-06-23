import { HospitalAddress } from '@/types/Doctor';

export const formatAddress = (h: HospitalAddress) =>
    `${h.street}, ${h.city}, ${h.state} ${h.postalCode}, ${h.country}`;
