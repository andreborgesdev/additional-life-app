/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ItemRequest = {
    title?: string;
    description?: string;
    condition: ItemRequest.condition;
    address?: string;
    isPickupPossible: boolean;
    isShippingPossible: boolean;
    imageUrls: Array<string>;
    categoryId: string;
};
export namespace ItemRequest {
    export enum condition {
        NEW = 'NEW',
        LIKE_NEW = 'LIKE_NEW',
        USED = 'USED',
        DEFECTIVE = 'DEFECTIVE',
    }
}

