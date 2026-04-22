import { IEvents, events } from "../base/Events.ts";
import { ensureElement } from "../../utils/utils.ts";
import { Success } from "../../types/index.ts";
import { Component } from "../base/Component";

export class OrderSuccess extends Component<Success> {
    private readonly successText: HTMLElement;
    private readonly closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, private readonly eventEmitter: IEvents) {
        super(container);
        this.successText = ensureElement<HTMLElement>(".order-success__description", this.container);
        this.closeButton = ensureElement<HTMLButtonElement>(".order-success__close", this.container);
        this.closeButton.addEventListener("click", () => {
            this.eventEmitter.emit(events.successClose);
        });
    }

    set total(value: number) {
        this.setText(this.successText, `Списано ${value} синапсов`);
    }
}