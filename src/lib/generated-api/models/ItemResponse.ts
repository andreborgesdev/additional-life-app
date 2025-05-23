/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryResponse } from './CategoryResponse';
import type { MinimalUserResponse } from './MinimalUserResponse';
export type ItemResponse = {
    id: string;
    title: string;
    description: string;
    condition: ItemResponse.condition;
    address: string;
    isPickupPossible: boolean;
    isShippingPossible: boolean;
    createdAt: string;
    updatedAt?: string;
    imageUrls: Array<string>;
    itemType: ItemResponse.itemType;
    externalUrl?: string;
    status: ItemResponse.status;
    active: boolean;
    owner: MinimalUserResponse;
    category: CategoryResponse;
    sourceExternalPlatform?: ItemResponse.sourceExternalPlatform;
};
export namespace ItemResponse {
    export enum condition {
        NEW = 'NEW',
        LIKE_NEW = 'LIKE_NEW',
        USED = 'USED',
        DEFECTIVE = 'DEFECTIVE',
    }
    export enum itemType {
        INTERNAL = 'INTERNAL',
        EXTERNAL = 'EXTERNAL',
    }
    export enum status {
        AVAILABLE = 'AVAILABLE',
        TAKEN = 'TAKEN',
    }
    export enum sourceExternalPlatform {
        ANIBIS = 'ANIBIS',
    }
}

