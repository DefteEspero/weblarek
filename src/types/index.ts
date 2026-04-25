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

export interface GalleryView {
  items: HTMLElement[];
}

export interface HeaderView {
  counter: number;
}

export interface ModalView {
  content: HTMLElement;
}

export interface CardView extends IProduct { }

export interface ProductEvent {
  id: string;
}

export interface CartView {
  items: HTMLElement[];
  total: number;
  disabled: boolean;
}

export interface CartCardView {
  title: string;
  price: number | null;
  index: number;
}

export interface PreviewCardView extends CardView {
  buttonText: string;
  buttonDisabled: boolean;
}

export interface FormView {
  valid: boolean;
  errors: string;
}

export interface FormEvent {
  form: string;
  field: keyof BuyerData;
  value: string;
}

export interface FormOrder extends FormView {
  address: string;
  payment: BuyerData["payment"];
}

export interface FormContacts extends FormView {
  email: string;
  phone: string;
}

export interface Success {
  total: number;
}