import { HospitalAddress } from '@/types/Doctor';

const formatAddress = (h: HospitalAddress) =>
    `${h.street}, ${h.city}, ${h.state} ${h.postalCode}, ${h.country}`;

export default formatAddress;
