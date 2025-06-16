export type TContentName = 'email' | 'password' | 'fullName';

export interface IUserAuth {
    _id: string;
    fullName?: string;
    email?: string;
    image?: string;
    roles?: string[];
}
