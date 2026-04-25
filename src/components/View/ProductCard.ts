import { Component } from "../base/Component.ts";
import { ensureElement } from "../../utils/utils";
import { CardView } from "../../types/index.ts";

export abstract class ProductCard<T extends Partial<CardView>> extends Component<T> {
    protected readonly cardTitle: HTMLElement;
    protected readonly cardPrice: HTMLElement;

    protected constructor(container: HTMLElement) {
        super(container);
        this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);
        this.cardPrice = ensureElement<HTMLElement>(".card__price", this.container);
    }

    set title(value: string) {
        this.setText(this.cardTitle, value);
    }

    set price(value: number | null) {
        this.setText(this.cardPrice, value === null ? "Бесценно" : `${value} синапсов`);
    }
}