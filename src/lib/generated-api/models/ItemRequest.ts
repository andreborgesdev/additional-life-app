/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Instant } from './Instant';
export type ItemRequest = {
    title?: string | null;
    description?: string | null;
    address?: string | null;
    imageUrl?: string | null;
    itemType?: ItemRequest.itemType | null;
    externalUrl?: string | null;
    originalPostedOn?: Instant | null;
    pickupInstructions?: string | null;
    conditionDescription?: string | null;
    categoryId?: number | null;
    sourcePlatformId?: number | null;
};
export namespace ItemRequest {
    export enum itemType {
        INTERNAL = 'INTERNAL',
        EXTERNAL = 'EXTERNAL',
    }
}

