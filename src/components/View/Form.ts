import { Component } from "../base/Component.ts";
import { IEvents, events } from "../base/Events.ts";
import { BuyerData, FormEvent, FormView } from "../../types/index.ts"
import { ensureElement } from "../../utils/utils.ts";

export abstract class Form<T extends FormView> extends Component<T> {
    protected readonly form: HTMLFormElement;
    protected readonly submitButton: HTMLButtonElement;
    protected readonly error: HTMLElement;

    protected constructor(container: HTMLFormElement, protected readonly eventEmitter: IEvents) {
        super(container);
        this.form = this.container as HTMLFormElement;
        this.submitButton = ensureElement<HTMLButtonElement>("button[type='submit']", this.form);
        this.error = ensureElement<HTMLElement>(".form__errors", this.form);
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.handleSubmit();
        });
        
        this.form.addEventListener('input', (event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement) {
                this.eventEmitter.emit<FormEvent>(events.formChange, {
                    form: this.form.name,
                    field: target.name as keyof BuyerData,
                    value: target.value
                });
            }
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this.error, value);
    }

    protected abstract handleSubmit(): void;
}