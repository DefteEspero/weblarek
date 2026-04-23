import { Component } from "../base/Component.ts";
import { categoryMap, CDN_URL } from "../../utils/constants.ts";
import { ensureElement } from "../../utils/utils";
import { CardView} from "../../types/index.ts";

export abstract class ProductCard<T extends Partial<CardView>> extends Component<T> {
    protected readonly cardTitle: HTMLElement;
    protected readonly cardPrice: HTMLElement | null;
    protected readonly cardCategory: HTMLElement | null;
    protected readonly cardImage: HTMLImageElement | null;
    protected readonly cardDescription: HTMLElement | null;

    protected constructor(container: HTMLElement) {
        super(container);
        this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);
        this.cardPrice = ensureElement<HTMLElement>(".card__price", this.container);
        this.cardCategory = this.container.querySelector<HTMLElement>(".card__category");
        this.cardImage = this.container.querySelector<HTMLImageElement>(".card__image");
        this.cardDescription = this.container.querySelector<HTMLElement>(".card__text");
    }

    protected currentId = '';
    set id(value: string) {
        this.currentId = value;
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this.cardTitle, value);
        if (this.cardImage) {
            this.cardImage.alt = value; 
        }
    }

    set price(value: number | null) {
        this.setText(this.cardPrice, value === null ? "Бесценно" : `${value} синапсов`);
    }

    set category(value: string) {
        const cardCategoryClass = categoryMap[value as keyof typeof categoryMap];

        if (!this.cardCategory) {
            return;
        }

        this.setText(this.cardCategory, value);
        Object.values(categoryMap).forEach((className) => {
            this.cardCategory?.classList.remove(className);
        });

        if (cardCategoryClass) {
            this.cardCategory.classList.add(cardCategoryClass);
        }
    }

    set description(value: string) {
        this.setText(this.cardDescription, value);
    }

    set image(value: string) {
        if (!this.cardImage) {
            return;
        }

        this.setImage(this.cardImage, `${CDN_URL}${value}`, this.cardTitle?.textContent || 'Товар');
    }
}