/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserRequest = {
    supabaseId: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    bio?: string;
    avatarUrl?: string;
    preferredLanguage?: UserRequest.preferredLanguage;
    emailVerified?: boolean;
    phoneVerified?: boolean;
};
export namespace UserRequest {
    export enum preferredLanguage {
        ENGLISH = 'ENGLISH',
        FRENCH = 'FRENCH',
        GERMAN = 'GERMAN',
    }
}

