import { ensureElement } from "../../utils/utils.ts";
import { ProductImageCard } from "./ProductCard.ts";
import { PreviewCardView } from "../../types/index.ts";

export class PreviewCard extends ProductImageCard<PreviewCardView> {
    private readonly button: HTMLButtonElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this.button = ensureElement<HTMLButtonElement>(".card__button", this.container);

        this.button.addEventListener("click", () => {
            if (!this.button.disabled) {
                onClick();
            }
        });
    }

    set buttonText(value: string) {
        this.setText(this.button, value);
    }

    set buttonDisabled(value: boolean) {
        this.button.disabled = value;
    }
}