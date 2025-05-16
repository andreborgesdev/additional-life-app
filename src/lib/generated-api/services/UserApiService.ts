/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRequest } from '../models/UserRequest';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UserApiService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get user by ID
     * Retrieves a user by their unique identifier
     * @param id
     * @returns UserResponse User found
     * @throws ApiError
     */
    public getUserById(
        id: string,
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `User not found`,
            },
        });
    }
    /**
     * Update an existing user
     * Updates a user with the provided data
     * @param id
     * @param requestBody
     * @returns UserResponse User updated successfully
     * @throws ApiError
     */
    public updateUser(
        id: string,
        requestBody: UserRequest,
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input data`,
                404: `User not found`,
            },
        });
    }
    /**
     * Delete a user
     * Deletes a user by their unique identifier
     * @param id
     * @returns void
     * @throws ApiError
     */
    public deleteUser(
        id: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `User not found`,
            },
        });
    }
    /**
     * Get all users
     * Retrieves a list of all users
     * @returns UserResponse Users retrieved successfully
     * @throws ApiError
     */
    public getAllUsers(): CancelablePromise<Array<UserResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/users',
        });
    }
    /**
     * Get user by Supabase ID
     * Retrieves a user by their Supabase ID
     * @param supabaseId
     * @returns UserResponse User found
     * @throws ApiError
     */
    public getUserBySupabaseId(
        supabaseId: string,
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/users/supabase/{supabaseId}',
            path: {
                'supabaseId': supabaseId,
            },
            errors: {
                404: `User not found`,
            },
        });
    }
    /**
     * Get user by email
     * Retrieves a user by their email address
     * @param email
     * @returns UserResponse User found
     * @throws ApiError
     */
    public getUserByEmail(
        email: string,
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/users/email/{email}',
            path: {
                'email': email,
            },
            errors: {
                404: `User not found`,
            },
        });
    }
}
