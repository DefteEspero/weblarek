import { IEvents, events } from "../base/Events.ts";
import { ensureElement } from "../../utils/utils.ts";
import { Form } from "./Form.ts";
import { FormContacts } from "../../types/index.ts";

export class ContactsForm extends Form<FormContacts> {
    private readonly phoneField: HTMLInputElement;
    private readonly emailField: HTMLInputElement;

    constructor(container: HTMLFormElement, eventEmitter: IEvents) {
        super(container, eventEmitter);
        this.phoneField = ensureElement<HTMLInputElement>("input[name='phone']", this.form);
        this.emailField = ensureElement<HTMLInputElement>("input[name='email']", this.form);
    }

    set phone(value: string) {
        this.phoneField.value = value;
    }

    set email(value: string) {
        this.emailField.value = value;
    }

    protected handleSubmit(): void {
        this.eventEmitter.emit(events.contactsSubmit);
    }
}