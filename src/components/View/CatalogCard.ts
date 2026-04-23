import { IEvents, events as catalogEvent } from "../base/Events.ts";
import { ProductCard } from "./ProductCard.ts";
import { CardView } from "../../types/index.ts";

export class CatalogCard extends ProductCard<CardView> {
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.container.addEventListener("click", () => {
            this.events.emit(catalogEvent.productSelect, { id: this.currentId });
        });
    }
}