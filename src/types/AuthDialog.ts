export type TContentName = 'email' | 'password' | 'fullName';

export interface IUserAuth {
    _id: string;
    fullName?: string;
    email?: string;
    imageUrl?: string;
    roles?: string[];
}
