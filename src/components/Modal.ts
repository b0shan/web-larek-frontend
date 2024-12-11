export interface IModal {
    content: HTMLElement;
    open(): void;
    close(): void;
}


export class Modal implements IModal {
    protected closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(protected container: HTMLElement) {
        this.closeButton = container.querySelector('.modal__close');
        this._content = container.querySelector('.modal__content');

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

}