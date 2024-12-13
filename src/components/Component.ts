export class Component<T> {
   
    protected constructor(protected readonly container: HTMLElement) {}

    setText(element: HTMLElement, text: string) {
        if (element) {
            element.textContent = String(text);
        }
    } // Устанавливает текст элемента.

    setElementDisabled(element: HTMLElement, status: boolean) {
        if (element) {
			if (status) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
    }// Блокирует элемент. 

    hideElement(element: HTMLElement){
        element.style.display = 'none';
    } // Скрывает элемент.

    showElement(element: HTMLElement) {
        element.style.removeProperty('display');
    } // Показывает элемент.

    setImage(element: HTMLImageElement, src: string, alt: string) {
        if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
    } // Устанавливает изображение и альтернативный текст.

    renderComponent(data: Partial<T>): HTMLElement {
        Object.assign(this, data);
        return this.container;
    }// Создаёт и возвращает компонент.
}