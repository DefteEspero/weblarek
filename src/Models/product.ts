import { product } from "../types/index.ts";

export class products {
    private items: product[] = [];
    private preview: product | null = null;

    setItems(items: product[]): void {
        this.items = [...items];
    }

    getItems(): product[] {
        return [...this.items];
    }

    getItemsById(id: string): product | undefined {
        return this.items.find((item) => item.id === id);
    }

    setPreview(item: product | null): void {
        this.preview = item;
    }

    getPreview(): product | null {
        return this.preview;
    }

}