import { Component } from "../base/Component.ts";
import { IEvents, events } from "../base/Events.ts";
import { ModalView } from "../../types/index.ts";
import { ensureElement } from "../../utils/utils.ts";

export class Modal extends Component<ModalView> {
    private readonly closeButton: HTMLButtonElement;
    private readonly contentContainer: HTMLElement;

    constructor(container: HTMLElement, private readonly eventEmitter: IEvents) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>(".modal__close", this.container);
        this.contentContainer = ensureElement<HTMLElement>(".modal__content", this.container);
        this.closeButton.addEventListener("click", () => {
            this.eventEmitter.emit(events.modalClose);
        });

        this.container.addEventListener("click", (event) => {
            if (event.target === this.container) {
                this.eventEmitter.emit(events.modalClose);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && this.container.classList.contains("modal_active")) {
                this.eventEmitter.emit(events.modalClose);
            }
        });
    }

    set content(value: HTMLElement) {
        this.contentContainer.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add("modal_active");
    }

    close(): void {
        this.container.classList.remove("modal_active");
        this.contentContainer.replaceChildren();
    }
}