/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChatMessage = {
    id?: string;
    conversationId?: string;
    itemId?: string;
    senderId?: string;
    recipientId?: string;
    content?: string;
    type?: ChatMessage.type;
    timestamp?: string;
};
export namespace ChatMessage {
    export enum type {
        CHAT = 'CHAT',
        JOIN = 'JOIN',
        LEAVE = 'LEAVE',
    }
}

