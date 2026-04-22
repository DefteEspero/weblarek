import { Component } from "../base/Component.ts";
import { IEvents } from "../base/Events.ts";
import { ModalView } from "../../types/index.ts";
import { ensureElement } from "../../utils/utils.ts";
import { events } from "../base/Events.ts";

export class Modal extends Component<ModalView> {
    private readonly closeButton: HTMLButtonElement;
    private readonly contentConteiner: HTMLElement;

    constructor(container: HTMLElement, private readonly eventEmitter: IEvents) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>(".modal__close", this.container);
        this.contentConteiner = ensureElement<HTMLElement>(".modal__content");
        this.closeButton.addEventListener("click", () => {
            this.eventEmitter.emit(events.modalClose);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && this.container.classList.contains("modal_active")) {
                this.eventEmitter.emit(events.modalClose);
            }
        });
    }

    set content(value: HTMLElement) {
        this.contentConteiner.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add("modal_active");
    }

    close(): void {
        this.container.classList.remove("modal_active");
        this.contentConteiner.replaceChildren();
    }
}