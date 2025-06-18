export interface IDoctorSpecialty {
    id: number;
    name: string;
    route: string;
    image: string;
}

export interface IDoctor {
    id: number;
    fullName: string;
    email: string;
    userId: string;
    imageUrl: string;
    degree: string;
    experience: string;
    about: string;
    fees: number;
    hospital: string;
    countryCode: string;
    phone: string;
    workStart: string;
    workEnd: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
    specialty: Specialty;
    insurancesList: InsurancesList[];
    hospitalAddress: HospitalAddress;
}

export interface HospitalAddress {
    id: number;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
}

export interface InsurancesList {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
}

export interface Specialty {
    id: number;
    name: string;
    route: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
}
