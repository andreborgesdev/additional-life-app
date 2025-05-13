/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemRequest } from '../models/ItemRequest';
import type { ItemResponse } from '../models/ItemResponse';
import type { Pageable } from '../models/Pageable';
import type { PageItemResponse } from '../models/PageItemResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ItemApiService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Update an existing item
     * Updates an item with the provided data
     * @param id
     * @param requestBody
     * @returns ItemResponse Item updated successfully
     * @throws ApiError
     */
    public updateItem(
        id: number,
        requestBody: ItemRequest,
    ): CancelablePromise<ItemResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/items/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input data`,
                404: `Item not found`,
            },
        });
    }
    /**
     * Delete an item
     * Soft deletes an item by marking it as inactive
     * @param id
     * @returns void
     * @throws ApiError
     */
    public deleteItem(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/items/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Item not found`,
            },
        });
    }
    /**
     * Create a new item
     * Creates a new item with the provided data
     * @param requestBody
     * @returns ItemResponse Item created successfully
     * @throws ApiError
     */
    public createItem(
        requestBody: ItemRequest,
    ): CancelablePromise<ItemResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/items',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input data`,
                422: `Item could not be processed`,
            },
        });
    }
    /**
     * Batch create items
     * Creates multiple items in a single request for better performance
     * @param requestBody
     * @returns any Items created successfully
     * @throws ApiError
     */
    public batchCreateItems(
        requestBody: Array<ItemRequest>,
    ): CancelablePromise<Record<string, Record<string, any>>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/items/batch',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input data`,
            },
        });
    }
    /**
     * Mark an item as taken
     * Updates an item's status to indicate it has been taken
     * @param id
     * @returns ItemResponse Item marked as taken successfully
     * @throws ApiError
     */
    public markItemAsTaken(
        id: number,
    ): CancelablePromise<ItemResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/v1/items/{id}/taken',
            path: {
                'id': id,
            },
            errors: {
                404: `Item not found`,
            },
        });
    }
    /**
     * Check if an item is available
     * Checks if an item exists, is active, and not taken
     * @param id
     * @returns any Availability check completed
     * @throws ApiError
     */
    public isItemAvailable(
        id: number,
    ): CancelablePromise<Record<string, Record<string, any>>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/items/{id}/available',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get items by type
     * Retrieves a paginated list of items of the specified type (INTERNAL or EXTERNAL)
     * @param itemType
     * @param pageable
     * @returns PageItemResponse Items retrieved successfully
     * @throws ApiError
     */
    public getItemsByType(
        itemType: 'INTERNAL' | 'EXTERNAL',
        pageable: Pageable,
    ): CancelablePromise<PageItemResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/items/type/{itemType}',
            path: {
                'itemType': itemType,
            },
            query: {
                'pageable': pageable,
            },
            errors: {
                400: `Invalid item type`,
            },
        });
    }
    /**
     * Get items by source platform
     * Retrieves a paginated list of items from the specified source platform
     * @param platformId
     * @param pageable
     * @returns PageItemResponse Items retrieved successfully
     * @throws ApiError
     */
    public getItemsBySourcePlatform(
        platformId: number,
        pageable: Pageable,
    ): CancelablePromise<PageItemResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/items/platform/{platformId}',
            path: {
                'platformId': platformId,
            },
            query: {
                'pageable': pageable,
            },
            errors: {
                404: `Source platform not found`,
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
            url: '/api/v1/items/category/{categoryId}',
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
