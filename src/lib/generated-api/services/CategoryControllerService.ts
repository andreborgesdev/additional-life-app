/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryDto } from '../models/CategoryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CategoryControllerService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @returns CategoryDto OK
     * @throws ApiError
     */
    public getAllCategories(): CancelablePromise<Array<CategoryDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/categories',
        });
    }
    /**
     * @param parentId
     * @returns CategoryDto OK
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
        });
    }
    /**
     * @param id
     * @returns CategoryDto OK
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
        });
    }
    /**
     * @returns CategoryDto OK
     * @throws ApiError
     */
    public getRootCategories(): CancelablePromise<Array<CategoryDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/categories/root',
        });
    }
}
