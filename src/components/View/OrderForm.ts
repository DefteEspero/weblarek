import { IEvents, events } from "../base/Events.ts";
import { Form } from "./Form.ts";
import { ensureElement } from "../../utils/utils.ts";
import { BuyerData, FormOrder } from "../../types/index.ts";

export class OrderForm extends Form<FormOrder> {
    private readonly addressField: HTMLInputElement;
    private readonly cardPaymentButton: HTMLButtonElement;
    private readonly cashPaymentButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, eventEmitter: IEvents) {
        super(container, eventEmitter);
        this.addressField = ensureElement<HTMLInputElement>("input[name='address']", this.form);
        this.cardPaymentButton = ensureElement<HTMLButtonElement>("button[name='card']", this.form);
        this.cashPaymentButton = ensureElement<HTMLButtonElement>("button[name='cash']", this.form);
        this.cardPaymentButton.addEventListener("click", () => {
            this.emitPaymentChange('online');
        });
        this.cashPaymentButton.addEventListener("click", () => {
            this.emitPaymentChange('offline');
        });
    }

    set address(value: string) {
        this.addressField.value = value;
    }

    set payment(value: BuyerData["payment"]) {
        this.cardPaymentButton.classList.toggle("button_alt-active", value === "online");
        this.cashPaymentButton.classList.toggle("button_alt-active", value === "offline");
    }

    protected handleSubmit(): void {
        this.eventEmitter.emit(events.orderSubmit);
    }

    private emitPaymentChange(value: BuyerData["payment"]): void {
        this.eventEmitter.emit(events.formChange, {
            form: this.form.name,
            field: "payment",
            value
        });
    }
}