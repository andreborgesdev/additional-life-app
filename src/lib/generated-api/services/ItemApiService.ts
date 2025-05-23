/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemRequest } from '../models/ItemRequest';
import type { ItemResponse } from '../models/ItemResponse';
import type { ItemStatusRequest } from '../models/ItemStatusRequest';
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
        id: string,
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
                401: `Unauthorized`,
                403: `Forbidden`,
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
        id: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/items/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
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
                401: `Unauthorized`,
                422: `Item could not be processed`,
            },
        });
    }
    /**
     * Change item status
     * Change the status of an item
     * @param id
     * @param requestBody
     * @returns ItemResponse Item marked as taken successfully
     * @throws ApiError
     */
    public changeItemStatus(
        id: string,
        requestBody: ItemStatusRequest,
    ): CancelablePromise<ItemResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/items/{id}/status',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
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
            url: '/api/v1/items/user/{userId}',
            errors: {
                401: `Unauthorized`,
                404: `User not found`,
            },
        });
    }
}
