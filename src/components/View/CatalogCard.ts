import { ProductImageCard } from "./ProductCard.ts";
import { CardView } from "../../types/index.ts";

export class CatalogCard extends ProductImageCard<CardView> {
    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this.container.addEventListener("click", onClick);
    }
}