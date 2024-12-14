import { Component } from './Component';
import { IForm } from '../types';
import { IEvents } from './base/events';
import { ensureElement} from '../utils/utils';

export class Form<T> extends Component<IForm> {
    protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.inputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

    set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	inputChange(field: keyof T, value: string) {
		this.events.emit(`order.${String(field)}:changed`, {
			field,
			value,
		});
	}

    resetFields() {
		this.container.reset();
	}

	renderForm(state: Partial<T> & IForm) {
		const { validForm, errors, ...inputs } = state;
		super.renderComponent({ validForm, errors });
		Object.assign(this, inputs);
		return this.container;
	}

}