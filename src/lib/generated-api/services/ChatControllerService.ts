/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatMessage } from '../models/ChatMessage';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ChatControllerService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param conversationId
     * @returns ChatMessage OK
     * @throws ApiError
     */
    public getChatHistoryByConversationId(
        conversationId: string,
    ): CancelablePromise<Array<ChatMessage>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/chat/{conversationId}/history',
            path: {
                'conversationId': conversationId,
            },
        });
    }
    /**
     * @param itemId
     * @param currentUser
     * @param otherUser
     * @returns ChatMessage OK
     * @throws ApiError
     */
    public getOrCreateConversationAndFetchHistory(
        itemId: string,
        currentUser: string,
        otherUser: string,
    ): CancelablePromise<Array<ChatMessage>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/chat/history',
            query: {
                'itemId': itemId,
                'currentUser': currentUser,
                'otherUser': otherUser,
            },
        });
    }
}
