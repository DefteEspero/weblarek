import { Component } from "../base/Component.ts";
import { IEvents, events } from "../base/Events.ts";
import { HeaderView } from "../../types/index.ts";
import { ensureElement } from "../../utils/utils.ts";

export class Header extends Component<HeaderView> {
    private readonly cartButton: HTMLButtonElement;
    private readonly cartCounter: HTMLElement;

    constructor(container: HTMLElement, private readonly eventEmitter: IEvents) {
        super(container);
        this.cartCounter = ensureElement<HTMLElement>(".header__cart-counter", this.container);
        this.cartButton = ensureElement<HTMLButtonElement>(".header__cart", this.container);
        this.cartButton.addEventListener("click", () => {
            this.eventEmitter.emit(events.cartOpen);
        });
    }

    set counter(value: number) {
        this.setText(this.cartCounter, value);
    }
}