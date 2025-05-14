/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryResponse } from '../models/CategoryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PublicCategoryApiService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get all categories
     * Retrieves a list of all categories
     * @returns CategoryResponse Categories retrieved successfully
     * @throws ApiError
     */
    public getAllCategories(): CancelablePromise<Array<CategoryResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/categories',
        });
    }
    /**
     * Get category by ID
     * Retrieves a category by its unique identifier
     * @param id
     * @returns CategoryResponse Category found
     * @throws ApiError
     */
    public getCategoryById(
        id: number,
    ): CancelablePromise<CategoryResponse> {
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
     * Get subcategories by parent ID
     * Retrieves a list of subcategories for a given parent category ID
     * @returns CategoryResponse Subcategories retrieved successfully
     * @throws ApiError
     */
    public getSubcategories(): CancelablePromise<Array<CategoryResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/categories/{id}/subcategories',
            errors: {
                404: `Parent category not found`,
            },
        });
    }
    /**
     * Get root categories
     * Retrieves a list of all root categories (categories without a parent)
     * @returns CategoryResponse Root categories retrieved successfully
     * @throws ApiError
     */
    public getRootCategories(): CancelablePromise<Array<CategoryResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/categories/root',
        });
    }
    /**
     * Get featured categories
     * Retrieves a list of featured categories
     * @returns CategoryResponse Featured categories retrieved successfully
     * @throws ApiError
     */
    public getFeaturedCategories(): CancelablePromise<Array<CategoryResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/categories/featured',
        });
    }
}
