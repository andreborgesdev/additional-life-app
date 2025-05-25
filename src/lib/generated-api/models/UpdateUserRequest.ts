/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateUserRequest = {
    name?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    bio?: string;
    avatarUrl?: string;
    preferredLanguage?: UpdateUserRequest.preferredLanguage;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    contactOptions?: Array<'EMAIL' | 'PHONE' | 'WHATSAPP'>;
};
export namespace UpdateUserRequest {
    export enum preferredLanguage {
        ENGLISH = 'ENGLISH',
        FRENCH = 'FRENCH',
        GERMAN = 'GERMAN',
    }
}

