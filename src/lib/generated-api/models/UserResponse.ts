/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserResponse = {
    id?: string;
    supabaseId?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    bio?: string;
    avatarUrl?: string;
    preferredLanguage?: UserResponse.preferredLanguage;
    createdAt?: string;
    updatedAt?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    active?: boolean;
};
export namespace UserResponse {
    export enum preferredLanguage {
        ENGLISH = 'ENGLISH',
        FRENCH = 'FRENCH',
        GERMAN = 'GERMAN',
    }
}

