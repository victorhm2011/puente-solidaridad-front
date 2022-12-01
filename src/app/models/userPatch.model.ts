export type Role = 'admin' | 'user';

export interface UserPatch {
    id?: string;

    name?: string;

    firstLastName?: string;

    secondLastName?: string;

    dateOfBirth?: Date;

    email?: string;

    role?: Role;
}