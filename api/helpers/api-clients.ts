/**
 * @author Aman Maithani
 *
 * API Client Utility using Playwright's APIRequestContext
 *
 * - Provides a reusable API client for sending HTTP requests (GET, POST, PUT, DELETE, PATCH).
 * - Supports optional headers, params, and body for flexibility.
 * - Wraps Playwright's request API into a strongly typed structure.
 */

import {Methods} from "../constants/methods";
import {APIRequestContext, APIResponse, request} from "@playwright/test";

/**
 * Interface representing an API request object
 */
export interface ApiRequest {
    /** Request URL (relative or absolute) */
    url: string;

    /** HTTP Method (GET, POST, PUT, DELETE, PATCH) */
    method: Methods;

    /** Optional query parameters */
    params?: Record<string, string | number>;

    /** Optional request headers */
    headers?: Record<string, string>;

    /** Optional request body (for POST, PUT, etc.) */
    body?: any;
}

/**
 * Interface representing an API response object
 */
export interface ApiResponse<T = any> {
    /** Response status code */
    statusCode: number;

    /** Response headers */
    headers?: Record<string, string>;

    /** Response body (typed) */
    body?: T;
}

/**
 * ApiClient class for making HTTP requests with Playwright
 */
export class ApiClient {
    /** Playwright API request context */
    private apiContext: APIRequestContext;

    /**
     * Private constructor to enforce factory method usage
     * @param apiContext Playwright's APIRequestContext
     */
    private constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }

    /**
     * Factory method to create a new ApiClient instance
     * @param baseUrl Base URL for API requests
     * @param defaultHeaders Optional default headers applied to every request
     * @returns ApiClient instance
     */
    static async create(baseUrl: string, defaultHeaders?: Record<string, string>): Promise<ApiClient> {
        const apiRequest: APIRequestContext = await request.newContext({
            baseURL: baseUrl,
            extraHTTPHeaders: defaultHeaders || {}
        });
        return new ApiClient(apiRequest);
    }

    /**
     * Sends an HTTP request based on ApiRequest configuration
     * @param request ApiRequest object containing url, method, headers, params, and body
     * @returns ApiResponse with statusCode, headers, and parsed body
     */
    async send<T = any>(request: ApiRequest): Promise<ApiResponse<T>> {
        let response: APIResponse;

        switch (request.method) {
            case Methods.GET:
                response = await this.apiContext.get(request.url, {
                    headers: request.headers,
                    params: request.params
                });
                break;

            case Methods.POST:
                response = await this.apiContext.post(request.url, {
                    headers: request.headers,
                    params: request.params,
                    data: request.body
                });
                break;

            case Methods.PUT:
                response = await this.apiContext.put(request.url, {
                    headers: request.headers,
                    params: request.params,
                    data: request.body
                });
                break;

            case Methods.DELETE:
                response = await this.apiContext.delete(request.url, {
                    headers: request.headers,
                    params: request.params
                });
                break;

            case Methods.PATCH:
                response = await this.apiContext.patch(request.url, {
                    headers: request.headers,
                    params: request.params
                });
                break;

            default:
                throw new Error(`${request.method} is not supported`);
        }

        return {
            statusCode: response.status(),
            body: await response.json() as T,
            headers: response.headers()
        };
    }
}
