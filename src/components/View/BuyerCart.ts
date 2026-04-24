import { Component } from "../base/Component.ts";
import { IEvents, events } from "../base/Events.ts";
import { ensureElement } from "../../utils/utils.ts";
import { CartView } from "../../types/index.ts";

export class BuyerCart extends Component<CartView> {
    private readonly list: HTMLElement;
    private readonly orderButton: HTMLButtonElement;
    private readonly totalCount: HTMLElement;

    constructor(container: HTMLElement, private readonly eventEmitter: IEvents) {
        super(container);
        this.list = ensureElement<HTMLElement>(".basket__list", this.container);
        this.orderButton = ensureElement<HTMLButtonElement>(".basket__button", this.container);
        this.totalCount = ensureElement<HTMLElement>(".basket__price", this.container);
        this.orderButton.addEventListener("click", () => {
            this.eventEmitter.emit(events.orderOpen);
        });
    }

    set items(value: HTMLElement[]) {
        this.list.replaceChildren(...value);
    }

    set total(value: number) {
        this.setText(this.totalCount, `${value} синапсов`);
    }

    set disabled(value: boolean) {
        this.orderButton.disabled = value;
    }
}