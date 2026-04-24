import { Component } from "../base/Component.ts";
import { categoryMap, CDN_URL } from "../../utils/constants.ts";
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

    set price(value: number) {
        this.setText(this.cardPrice, value === null ? "Бесценно" : `${value} синапсов`);
    }
}

export abstract class ProductImageCard<T extends Partial<CardView>> extends ProductCard<T> {
    protected readonly cardCategory: HTMLElement;
    protected readonly cardImage: HTMLImageElement;

    protected constructor(container: HTMLElement) {
        super(container);
        this.cardCategory = ensureElement<HTMLElement>(".card__category", this.container);
        this.cardImage = ensureElement<HTMLImageElement>(".card__image", this.container);
    }

    set title(value: string) {
        this.setText(this.cardTitle, value);
        this.cardImage.alt = value;
    }

    set category(value: string) {
        const cardCategoryClass = categoryMap[value as keyof typeof categoryMap];

        this.setText(this.cardCategory, value);
        Object.values(categoryMap).forEach((className) => {
            this.cardCategory.classList.remove(className);
        });

        if (cardCategoryClass) {
            this.cardCategory.classList.add(cardCategoryClass);
        }
    }

    set image(value: string) {
        this.setImage(this.cardImage, `${CDN_URL}${value}`, this.cardTitle.textContent || "Товар");
    }
}