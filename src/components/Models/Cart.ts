import { IProduct } from "../../types/index.ts";

export class Cart {
    private items: IProduct[] = [];
    
    getItems(): IProduct[] {
        return [ ...this.items ];
    }

    addItem(item: IProduct): void {
        this.items.push(item);
    }

    removeItem(item: IProduct): void {
        this.items = this.items.filter((cartTest) => cartTest.id !== item.id);;
    }

    clearCart(): void {
        this.items = [];
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
    }

    getItemCount(): number {
        return this.items.length;
    }

    inCart(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }

}
