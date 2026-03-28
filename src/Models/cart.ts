import { product } from "../types/index.ts";

export class cart {
    private items: product[] = [];
    
    getItems(): product[] {
        return { ...this.items };
    }

    addItems(item: product): void {
        this.items.push(item);
    }

    removeItem(item: product): void {
        this.items = this.items.filter((cartTest) => cartTest.id !== item.id);;
    }

    clearCart(): void {
        this.items = [];
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
    }

    getItmesCount(): number {
        return this.items.length;
    }

    inCart(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }

}
