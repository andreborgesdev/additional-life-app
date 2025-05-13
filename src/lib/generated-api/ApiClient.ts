/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';
import { ItemApiService } from './services/ItemApiService';
import { PingControllerService } from './services/PingControllerService';
import { PublicCategoryApiService } from './services/PublicCategoryApiService';
import { PublicItemApiService } from './services/PublicItemApiService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class ApiClient {
    public readonly itemApi: ItemApiService;
    public readonly pingController: PingControllerService;
    public readonly publicCategoryApi: PublicCategoryApiService;
    public readonly publicItemApi: PublicItemApiService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'http://localhost:8080',
            VERSION: config?.VERSION ?? '0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.itemApi = new ItemApiService(this.request);
        this.pingController = new PingControllerService(this.request);
        this.publicCategoryApi = new PublicCategoryApiService(this.request);
        this.publicItemApi = new PublicItemApiService(this.request);
    }
}

