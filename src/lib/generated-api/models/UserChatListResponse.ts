/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemResponse } from './ItemResponse';
import type { MinimalUserResponse } from './MinimalUserResponse';
export type UserChatListResponse = {
    chatId: string;
    item: ItemResponse;
    otherUser: MinimalUserResponse;
    unreadMessagesCount: number;
    lastMessage: string;
    timestamp: string;
};

