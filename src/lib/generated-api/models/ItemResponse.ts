/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryDto } from './CategoryDto';
import type { Instant } from './Instant';
import type { SourcePlatformDto } from './SourcePlatformDto';
export type ItemResponse = {
    id?: number | null;
    title?: string | null;
    description?: string | null;
    address?: string | null;
    isTaken?: boolean | null;
    postedOn?: Instant | null;
    updatedAt?: Instant | null;
    imageUrl?: string | null;
    itemType?: ItemResponse.itemType | null;
    externalUrl?: string | null;
    originalPostedOn?: Instant | null;
    pickupInstructions?: string | null;
    conditionDescription?: string | null;
    active?: boolean | null;
    user?: string | null;
    category?: CategoryDto | null;
    sourcePlatform?: SourcePlatformDto | null;
};
export namespace ItemResponse {
    export enum itemType {
        INTERNAL = 'INTERNAL',
        EXTERNAL = 'EXTERNAL',
    }
}

