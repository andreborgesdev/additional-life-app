/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemResponse } from '../models/ItemResponse';
import type { Pageable } from '../models/Pageable';
import type { PageItemResponse } from '../models/PageItemResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PublicItemApiService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get paginated list of available items
     * Retrieves a paginated list of items that are active and not taken
     * @param page
     * @param size
     * @param sortBy
     * @param direction
     * @returns PageItemResponse Available items retrieved successfully
     * @throws ApiError
     */
    public getItems(
        page?: number,
        size: number = 10,
        sortBy: string = 'postedOn',
        direction: string = 'desc',
    ): CancelablePromise<PageItemResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/public/items',
            query: {
                'page': page,
                'size': size,
                'sortBy': sortBy,
                'direction': direction,
            },
        });
    }
    /**
     * Get item by ID
     * Retrieves an item by its unique identifier
     * @param id
     * @returns ItemResponse Item found
     * @throws ApiError
     */
    public getItemById(
        id: number,
    ): CancelablePromise<ItemResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/public/items/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Item not found`,
            },
        });
    }
    /**
     * Get all items from a specific user
     * Retrieves all active items posted by the specified user
     * @returns ItemResponse Items retrieved successfully
     * @throws ApiError
     */
    public getUserItems(): CancelablePromise<Array<ItemResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/public/items/user/{userId}',
            errors: {
                404: `User not found`,
            },
        });
    }
    /**
     * Search items by keyword
     * Searches for items containing the specified keyword in title or description
     * @param keyword
     * @param pageable
     * @returns PageItemResponse Search completed successfully
     * @throws ApiError
     */
    public searchItems(
        keyword: string,
        pageable: Pageable,
    ): CancelablePromise<PageItemResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/public/items/search',
            query: {
                'keyword': keyword,
                'pageable': pageable,
            },
        });
    }
}
