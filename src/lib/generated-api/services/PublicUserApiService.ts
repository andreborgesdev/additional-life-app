/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserRequest } from '../models/CreateUserRequest';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PublicUserApiService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create a new user
     * Creates a new user with the provided data
     * @param requestBody
     * @returns UserResponse User created successfully
     * @throws ApiError
     */
    public createUser(
        requestBody: CreateUserRequest,
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/public/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input data`,
                409: `User already exists`,
            },
        });
    }
}
