import { Component } from "../base/Component.ts";
import { IEvents } from "../base/Events.ts";
import { PageView } from "../../types/index.ts";
import { ensureElement } from "../../utils/utils.ts";
import { events } from "../base/Events.ts";

export class Page extends Component<PageView> {
    private readonly gallery: HTMLElement;
    private readonly cartButton: HTMLButtonElement;
    private readonly cartCounter: HTMLElement;
    
    constructor(conteiner: HTMLElement, private readonly eventEmiter: IEvents) {
        super(conteiner);
        this.gallery = ensureElement<HTMLElement>(".gallery", this.container);
        this.cartButton = ensureElement<HTMLButtonElement>(".header__basket", this.container);
        this.cartCounter = ensureElement<HTMLElement>(".header__basket-counter", this.container);
        this.cartButton.addEventListener('click', () => {
            this.eventEmiter.emit(events.cartOpen);
        });
    }

    set catalog(items: HTMLElement[]) {
        this.gallery.replaceChildren(...items);
    }

    set counter(value: number) {
        this.setText(this.cartCounter, value);
    }
}