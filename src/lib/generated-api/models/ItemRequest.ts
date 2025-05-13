/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ItemRequest = {
    title?: string;
    description?: string;
    address?: string;
    imageUrl?: string;
    itemType: ItemRequest.itemType;
    externalUrl?: string;
    pickupInstructions?: string;
    conditionDescription?: string;
    categoryId: number;
    sourcePlatformId: number;
};
export namespace ItemRequest {
    export enum itemType {
        INTERNAL = 'INTERNAL',
        EXTERNAL = 'EXTERNAL',
    }
}

