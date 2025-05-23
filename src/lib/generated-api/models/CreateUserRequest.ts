/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateUserRequest = {
    supabaseId: string;
    name?: string;
    email?: string;
    authProvider: CreateUserRequest.authProvider;
    avatarUrl?: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
};
export namespace CreateUserRequest {
    export enum authProvider {
        SUPBASE = 'SUPBASE',
        GOOGLE = 'GOOGLE',
        FACEBOOK = 'FACEBOOK',
    }
}

