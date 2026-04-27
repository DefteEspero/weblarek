import { ProductCard } from "./ProductCard.ts";
import { ensureElement } from "../../utils/utils.ts";
import { CartCardView } from "../../types/index.ts";

export class CartCard extends ProductCard<CartCardView> {
    private readonly cardIndex: HTMLElement;
    private readonly deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, onDelete: () => void) {
        super(container);
        this.cardIndex = ensureElement<HTMLElement>(".cart__item-index", this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>(".cart__item-delete", this.container);
        this.deleteButton.addEventListener("click", onDelete);
    }

    set index(value: number) {
        this.setText(this.cardIndex, value);
    }
}