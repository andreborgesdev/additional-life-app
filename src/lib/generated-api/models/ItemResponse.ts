/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryDto } from './CategoryDto';
import type { SourcePlatformDto } from './SourcePlatformDto';
export type ItemResponse = {
    id?: number;
    title?: string;
    description?: string;
    address?: string;
    postedOn?: string;
    updatedAt?: string;
    imageUrl?: string;
    itemType?: ItemResponse.itemType;
    externalUrl?: string;
    originalPostedOn?: string;
    pickupInstructions?: string;
    conditionDescription?: string;
    active?: boolean;
    owner?: string;
    category?: CategoryDto;
    sourcePlatform?: SourcePlatformDto;
    taken?: boolean;
};
export namespace ItemResponse {
    export enum itemType {
        INTERNAL = 'INTERNAL',
        EXTERNAL = 'EXTERNAL',
    }
}

