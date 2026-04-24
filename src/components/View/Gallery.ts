import { Component } from "../base/Component.ts";
import { GalleryView } from "../../types/index.ts";

export class Gallery extends Component<GalleryView> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(value: HTMLElement[]) {
        this.container.replaceChildren(...value);
    }
}