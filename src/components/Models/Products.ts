import { IProduct } from "../../types/index.ts";
import { IEvents, events } from "../base/Events.ts";

export class Products {
    private items: IProduct[] = [];
    private preview: IProduct | null = null;

    constructor(private events: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = [...items];
        this.events.emit(events.productsChange);
    }

    getItems(): IProduct[] {
        return [...this.items];
    }

    getItemById(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    setPreview(item: IProduct | null): void {
        this.preview = item;
        this.events.emit(events.previewChanged);
    }

    getPreview(): IProduct | null {
        return this.preview;
    }

}