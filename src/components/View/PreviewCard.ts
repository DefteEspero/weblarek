import { IEvents, events } from "../base/Events.ts";
import { ensureElement } from "../../utils/utils.ts";
import { ProductCard } from "./ProductCard.ts";
import { PreviewCardView } from "../../types/index.ts";

export class PreviewCard extends ProductCard<PreviewCardView> {
    private readonly button: HTMLButtonElement;
    private isInCart = false;

    constructor(container: HTMLElement, private readonly eventEmitter: IEvents) {
        super(container);
        this.button = ensureElement<HTMLButtonElement>(".card__button", this.container);

        this.button.addEventListener("click", () => {
            if (this.button.disabled) {
                return;
            }

            if (this.isInCart) {
                this.eventEmitter.emit(events.productsRemove, { id: this.currentId });
            } else {
                this.eventEmitter.emit(events.productsAdd, { id: this.currentId });
            }
        });
    }

    set buttonText(value: string) {
        this.setText(this.button, value);
    }

    set buttonDisabled(value: boolean) {
        this.button.disabled = value;
    }

    set inCart(value: boolean) {
        this.isInCart = value;
    }
}