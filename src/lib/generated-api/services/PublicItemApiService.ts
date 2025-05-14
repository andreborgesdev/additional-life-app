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
    /**
     * Get items by category
     * Retrieves a paginated list of items in the specified category
     * @param categoryId
     * @param pageable
     * @returns PageItemResponse Items retrieved successfully
     * @throws ApiError
     */
    public getItemsByCategory(
        categoryId: number,
        pageable: Pageable,
    ): CancelablePromise<PageItemResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/public/items/category/{categoryId}',
            path: {
                'categoryId': categoryId,
            },
            query: {
                'pageable': pageable,
            },
            errors: {
                404: `Category not found`,
            },
        });
    }
}
