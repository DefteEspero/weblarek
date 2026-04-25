import { ensureElement } from "../../utils/utils.ts";
import { ProductVisualCard } from "./ProductVisualCard.ts";
import { PreviewCardView } from "../../types/index.ts";

export class PreviewCard extends ProductVisualCard<PreviewCardView> {
    private readonly button: HTMLButtonElement;
    private readonly descriptionField: HTMLElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this.button = ensureElement<HTMLButtonElement>(".card__button", this.container);
        this.descriptionField = ensureElement<HTMLElement>(".card__text", this.container);

        this.button.addEventListener("click", () => {
            if (!this.button.disabled) {
                onClick();
            }
        });
    }

    set description(value: string) {
        this.setText(this.descriptionField, value);
    }

    set buttonText(value: string) {
        this.setText(this.button, value);
    }

    set buttonDisabled(value: boolean) {
        this.button.disabled = value;
    }
}