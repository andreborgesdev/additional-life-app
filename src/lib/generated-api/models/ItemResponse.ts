/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryResponse } from './CategoryResponse';
export type ItemResponse = {
    id?: number;
    title?: string;
    description?: string;
    condition?: ItemResponse.condition;
    address?: string;
    postedOn?: string;
    updatedAt?: string;
    imageUrl?: string;
    itemType?: ItemResponse.itemType;
    externalUrl?: string;
    active?: boolean;
    owner?: string;
    category?: CategoryResponse;
    sourceExternalPlatform?: ItemResponse.sourceExternalPlatform;
    pickupPossible?: boolean;
    deliveryPossible?: boolean;
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
    export enum sourceExternalPlatform {
        ANIBIS = 'ANIBIS',
    }
}

