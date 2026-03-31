import { IApi, OrderRequest, OrderResponse, ProductResponse } from "../../types/index.ts";

export class WebLarekApi {
    constructor(private api: IApi) { };

    getProducts(): Promise<ProductResponse> {
        return this.api.get<ProductResponse>('/product/');
    }

    createOrder(order: OrderRequest): Promise<OrderResponse> {
        return this.api.post<OrderResponse>('/order/', order);
    }
}