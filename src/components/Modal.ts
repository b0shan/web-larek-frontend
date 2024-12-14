import { IRenderData } from "../types";
import { Component } from "./Component";
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Modal extends Component <IRenderData> {
    protected closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.content = container.querySelector('.modal__content');
        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this.container.querySelector('.modal__container').addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
    }
    
    close() {
        this.container.classList.remove('modal_active');
    }

    render(data: IRenderData): HTMLElement {
		super.renderComponent(data);
		this.open();
		return this.container;
	}


}