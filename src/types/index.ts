export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  description: string;
}

export interface BuyerData {
	address: string;
	phone: string;
	email: string;
	payment: BuyerPayment | '';
}

export interface ProductResponse {
  items: IProduct[];
  total: number;
}

export interface OrderRequest extends BuyerData {
  payment: BuyerPayment;
  items: IProduct['id'][];
  total: number;
}

export interface OrderResponse {
  id: number;
  total: number;
}
    
export type BuyerPayment = `online` | `offline`;
export type BuyerError = Partial<Record<keyof BuyerData, string>>;

