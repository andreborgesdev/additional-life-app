/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRequest } from '../models/UserRequest';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PublicUserApiService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create a new user
     * Creates a new user with the provided data
     * @param captchaToken
     * @param requestBody
     * @returns UserResponse User created successfully
     * @throws ApiError
     */
    public createUser(
        captchaToken: string,
        requestBody: UserRequest,
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/public/users',
            query: {
                'captchaToken': captchaToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input data`,
            },
        });
    }
}
