import { ProductVisualCard } from "./ProductVisualCard.ts";
import { CardView } from "../../types/index.ts";

export class CatalogCard extends ProductVisualCard<CardView> {
    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this.container.addEventListener("click", onClick);
    }
}