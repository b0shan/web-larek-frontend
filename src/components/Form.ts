import { IForm } from '../types';
import { ensureElement} from '../utils/utils';
import { Component } from './Component';
import { IEvents } from './base/events';


export class Form<T> extends Component<IForm> {
	protected submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.submit = ensureElement<HTMLButtonElement>('button[type=submit]',this.container);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
		this.container.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.inputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	set valid(value: boolean) {this.submit.disabled = !value;}
	set errors(value: string) {this.setText(this._errors, value);}

	inputChange(field: keyof T, value: string) {
		this.events.emit(`order.${String(field)}:changed`, {field,value,});
	}

	renderForm(state: Partial<T> & IForm) {
		const { valid, errors, ...inputs } = state;
		super.renderComponent({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}

	resetFields() {this.container.reset();}
}