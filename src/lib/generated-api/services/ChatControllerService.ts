/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatHistoryWithOnlineStatusResponse } from '../models/ChatHistoryWithOnlineStatusResponse';
import type { UserChatListResponse } from '../models/UserChatListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ChatControllerService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param id
     * @param userId
     * @returns any OK
     * @throws ApiError
     */
    public markChatAsRead(
        id: string,
        userId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/chat/{id}/mark-as-read/{userId}',
            path: {
                'id': id,
                'userId': userId,
            },
        });
    }
    /**
     * @param id
     * @param userId
     * @returns number OK
     * @throws ApiError
     */
    public getUnreadChatCount(
        id: string,
        userId: string,
    ): CancelablePromise<number> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/chat/{id}/unread-count/{userId}',
            path: {
                'id': id,
                'userId': userId,
            },
        });
    }
    /**
     * @param id
     * @returns ChatHistoryWithOnlineStatusResponse OK
     * @throws ApiError
     */
    public getChatHistoryByChatId(
        id: string,
    ): CancelablePromise<ChatHistoryWithOnlineStatusResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/chat/{id}/history',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param userId
     * @returns UserChatListResponse OK
     * @throws ApiError
     */
    public getUserChatsList(
        userId: string,
    ): CancelablePromise<Array<UserChatListResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/chat/user/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * @param itemId
     * @param userId
     * @returns string OK
     * @throws ApiError
     */
    public getChatIdByItemIdAndUserId(
        itemId: string,
        userId: string,
    ): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/chat/item/{itemId}/user/{userId}',
            path: {
                'itemId': itemId,
                'userId': userId,
            },
        });
    }
}
