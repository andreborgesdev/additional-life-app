/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Notification } from '../models/Notification';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class NotificationControllerService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param userId
     * @returns Notification OK
     * @throws ApiError
     */
    public getNotificationsByUserId(
        userId: string,
    ): CancelablePromise<Array<Notification>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/notifications/user/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
}
