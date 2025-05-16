/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemResponse } from '../models/ItemResponse';
import type { PageItemResponse } from '../models/PageItemResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PublicItemApiService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get paginated list of available items
     * Retrieves a paginated list of items that are active and not taken
     * @param query Full-text search query
     * @param category Item category
     * @param condition Item condition
     * @param sortBy Sort field
     * @param sortDirection Sort direction
     * @param page Page number (zero-based)
     * @param size Page size
     * @returns PageItemResponse Available items retrieved successfully
     * @throws ApiError
     */
    public getItems(
        query?: string,
        category?: string,
        condition?: string,
        sortBy: string = 'createdAt',
        sortDirection?: 'asc' | 'desc',
        page?: number,
        size: number = 20,
    ): CancelablePromise<PageItemResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/public/items',
            query: {
                'query': query,
                'category': category,
                'condition': condition,
                'sortBy': sortBy,
                'sortDirection': sortDirection,
                'page': page,
                'size': size,
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
        id: string,
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
}
