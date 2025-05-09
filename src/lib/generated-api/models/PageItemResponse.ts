/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemResponse } from './ItemResponse';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
export type PageItemResponse = {
    totalPages?: number;
    totalElements?: number;
    first?: boolean;
    last?: boolean;
    size?: number;
    content?: Array<ItemResponse>;
    number?: number;
    sort?: SortObject;
    pageable?: PageableObject;
    numberOfElements?: number;
    empty?: boolean;
};

