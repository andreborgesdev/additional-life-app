/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChatMessageResponse = {
    id: string;
    chatId: string;
    itemId: string;
    senderId: string;
    recipientId: string;
    content: string;
    type: ChatMessageResponse.type;
    timestamp: string;
};
export namespace ChatMessageResponse {
    export enum type {
        CHAT = 'CHAT',
        JOIN = 'JOIN',
        LEAVE = 'LEAVE',
    }
}

