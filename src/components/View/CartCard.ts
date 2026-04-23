import { IEvents, events } from "../base/Events.ts";
import { ProductCard } from "./ProductCard.ts";
import { ensureElement } from "../../utils/utils.ts";
import { CartCardView } from "../../types/index.ts";

export class CartCard extends ProductCard<CartCardView> {
    private readonly cardIndex: HTMLElement;
    private readonly deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, private readonly eventEmitter: IEvents) {
        super(container);
        this.cardIndex = ensureElement<HTMLElement>(".basket__item-index", this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>(".basket__item-delete", this.container);
        this.deleteButton.addEventListener("click", () => {
            this.eventEmitter.emit(events.productsRemove, { id: this.currentId });
        });
    }

    set index(value: number) {
        this.setText(this.cardIndex, value);
    }
}