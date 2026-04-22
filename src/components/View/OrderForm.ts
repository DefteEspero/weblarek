import { IEvents, events } from "../base/Events.ts";
import { Form } from "./Form.ts";
import { ensureElement } from "../../utils/utils.ts";
import { BuyerData, FormOrder } from "../../types/index.ts";

export class OrderForm extends Form<FormOrder> {
    private readonly addressField: HTMLInputElement;
    private readonly onlinePaymentButton: HTMLButtonElement;
    private readonly offlinePaymentButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, eventEmitter: IEvents) {
        super(container, eventEmitter);
        this.addressField = ensureElement<HTMLInputElement>("input[name='address']", this.form);
        this.onlinePaymentButton = ensureElement<HTMLButtonElement>("button[name='card']", this.form);
        this.offlinePaymentButton = ensureElement<HTMLButtonElement>("button[name='cash']", this.form);
        this.onlinePaymentButton.addEventListener("click", () => {
            this.emitPaymentChange('online');
        });
        this.offlinePaymentButton.addEventListener("click", () => {
            this.emitPaymentChange('offline');
        });
    }

    set address(value: string) {
        this.addressField.value = value;
    }

    set payment(value: BuyerData["payment"]) {
        this.onlinePaymentButton.classList.toggle("button_alt-active", value === "online");
        this.offlinePaymentButton.classList.toggle("button_alt-active", value === "offline");
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