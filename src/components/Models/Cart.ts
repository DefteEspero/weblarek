import { IProduct } from "../../types/index.ts";
import { IEvents, events } from "../base/Events.ts";

export class Cart {
    private items: IProduct[] = [];

    constructor(private events: IEvents) {}
    
    getItems(): IProduct[] {
        return [ ...this.items ];
    }

    addItem(item: IProduct): void {
        if (this.inCart(item.id)) {
            return;
        }
        
        this.items.push(item);
        this.events.emit(events.cartChanged);
    }

    removeItem(id: string): void {
        this.items = this.items.filter((item) => item.id !== id);
        this.events.emit(events.cartChanged);
    }

    clearCart(): void {
        this.items = [];
        this.events.emit(events.cartChanged);
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
