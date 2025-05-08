/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemRequest } from "../models/ItemRequest";
import type { ItemResponse } from "../models/ItemResponse";
import type { Void } from "../models/Void";
import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";
export class DefaultService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Create a new item
   * Creates a new item with the provided data
   * @param requestBody
   * @returns ItemResponse OK
   * @throws ApiError
   */
  public postApiV1Items(
    requestBody: ItemRequest
  ): CancelablePromise<ItemResponse> {
    return this.httpRequest.request({
      method: "POST",
      url: "/api/v1/items",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Get paginated list of all active items
   * Retrieves a paginated list of all active items with sorting options
   * @param page
   * @param size
   * @param sortBy
   * @param direction
   * @returns ItemResponse OK
   * @throws ApiError
   */
  public getApiV1Items(
    page: number = 0,
    size: number = 10,
    sortBy: string = "postedOn",
    direction: string = "desc"
  ): CancelablePromise<ItemResponse> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/v1/items",
      query: {
        page: page,
        size: size,
        sortBy: sortBy,
        direction: direction,
      },
    });
  }
  /**
   * Get item by ID
   * Retrieves an item by its unique identifier
   * @param id
   * @returns ItemResponse OK
   * @throws ApiError
   */
  public getApiV1Items1(id: number): CancelablePromise<ItemResponse> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/v1/items/{id}",
      path: {
        id: id,
      },
    });
  }
  /**
   * Update an existing item
   * Updates an item with the provided data
   * @param id
   * @param requestBody
   * @returns ItemResponse OK
   * @throws ApiError
   */
  public putApiV1Items(
    id: number,
    requestBody: ItemRequest
  ): CancelablePromise<ItemResponse> {
    return this.httpRequest.request({
      method: "PUT",
      url: "/api/v1/items/{id}",
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Delete an item
   * Soft deletes an item by marking it as inactive
   * @param id
   * @returns Void OK
   * @throws ApiError
   */
  public deleteApiV1Items(id: number): CancelablePromise<Void> {
    return this.httpRequest.request({
      method: "DELETE",
      url: "/api/v1/items/{id}",
      path: {
        id: id,
      },
    });
  }
  /**
   * Get paginated list of available items
   * Retrieves a paginated list of items that are active and not taken
   * @param page
   * @param size
   * @param sortBy
   * @param direction
   * @returns ItemResponse OK
   * @throws ApiError
   */
  public getApiV1ItemsAvailable(
    page: number = 0,
    size: number = 10,
    sortBy: string = "postedOn",
    direction: string = "desc"
  ): CancelablePromise<ItemResponse> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/v1/items/available",
      query: {
        page: page,
        size: size,
        sortBy: sortBy,
        direction: direction,
      },
    });
  }
  /**
   * Search items by keyword
   * Searches for items containing the specified keyword in title or description
   * @param keyword
   * @returns ItemResponse OK
   * @throws ApiError
   */
  public getApiV1ItemsSearch(keyword: string): CancelablePromise<ItemResponse> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/v1/items/search",
      query: {
        keyword: keyword,
      },
    });
  }
  /**
   * Mark an item as taken
   * Updates an item's status to indicate it has been taken
   * @param id
   * @returns ItemResponse OK
   * @throws ApiError
   */
  public patchApiV1ItemsTaken(id: number): CancelablePromise<ItemResponse> {
    return this.httpRequest.request({
      method: "PATCH",
      url: "/api/v1/items/{id}/taken",
      path: {
        id: id,
      },
    });
  }
  /**
   * Get all items from a specific user
   * Retrieves all active items posted by the specified user
   * @param userId
   * @returns ItemResponse OK
   * @throws ApiError
   */
  public getApiV1ItemsUser(
    userId?: any
  ): CancelablePromise<Array<ItemResponse>> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/v1/items/user/{userId}",
      path: {
        userId: userId,
      },
    });
  }
  /**
   * Get items by category
   * Retrieves a paginated list of items in the specified category
   * @param categoryId
   * @returns ItemResponse OK
   * @throws ApiError
   */
  public getApiV1ItemsCategory(
    categoryId: number
  ): CancelablePromise<ItemResponse> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/v1/items/category/{categoryId}",
      path: {
        categoryId: categoryId,
      },
    });
  }
  /**
   * Get items by type
   * Retrieves a paginated list of items of the specified type (INTERNAL or EXTERNAL)
   * @param itemType
   * @returns ItemResponse OK
   * @throws ApiError
   */
  public getApiV1ItemsType(
    itemType: "INTERNAL" | "EXTERNAL"
  ): CancelablePromise<ItemResponse> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/v1/items/type/{itemType}",
      path: {
        itemType: itemType,
      },
    });
  }
  /**
   * Get items by source platform
   * Retrieves a paginated list of items from the specified source platform
   * @param platformId
   * @returns ItemResponse OK
   * @throws ApiError
   */
  public getApiV1ItemsPlatform(
    platformId: number
  ): CancelablePromise<ItemResponse> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/v1/items/platform/{platformId}",
      path: {
        platformId: platformId,
      },
    });
  }
  /**
   * Batch create items
   * Creates multiple items in a single request for better performance
   * @param requestBody
   * @returns string OK
   * @throws ApiError
   */
  public postApiV1ItemsBatch(
    requestBody: Array<ItemRequest>
  ): CancelablePromise<string> {
    return this.httpRequest.request({
      method: "POST",
      url: "/api/v1/items/batch",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Check if an item is available
   * Checks if an item exists, is active, and not taken
   * @param id
   * @returns string OK
   * @throws ApiError
   */
  public getApiV1ItemsAvailable1(id: number): CancelablePromise<string> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/v1/items/{id}/available",
      path: {
        id: id,
      },
    });
  }
}
