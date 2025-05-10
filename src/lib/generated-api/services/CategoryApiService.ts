/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryDto } from '../models/CategoryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CategoryApiService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get all categories
     * Retrieves a list of all categories
     * @returns CategoryDto Categories retrieved successfully
     * @throws ApiError
     */
    public getAllCategories(): CancelablePromise<Array<CategoryDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/categories',
        });
    }
    /**
     * Get subcategories by parent ID
     * Retrieves a list of subcategories for a given parent category ID
     * @param parentId
     * @returns CategoryDto Subcategories retrieved successfully
     * @throws ApiError
     */
    public getSubcategories(
        parentId: number,
    ): CancelablePromise<Array<CategoryDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/categories/{parentId}/subcategories',
            path: {
                'parentId': parentId,
            },
            errors: {
                404: `Parent category not found`,
            },
        });
    }
    /**
     * Get category by ID
     * Retrieves a category by its unique identifier
     * @param id
     * @returns CategoryDto Category found
     * @throws ApiError
     */
    public getCategoryById(
        id: number,
    ): CancelablePromise<CategoryDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/categories/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Category not found`,
            },
        });
    }
    /**
     * Get root categories
     * Retrieves a list of all root categories (categories without a parent)
     * @returns CategoryDto Root categories retrieved successfully
     * @throws ApiError
     */
    public getRootCategories(): CancelablePromise<Array<CategoryDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/categories/root',
        });
    }
}
