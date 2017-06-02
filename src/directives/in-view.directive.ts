import { Directive, ElementRef, Output, Input, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { defer, forEach } from 'lodash';

import { TriggerService } from '../services';

const SELECTOR = 'vp-in-view';

export interface IConfig {
	infinite?: boolean;
	margin?: number;
	marginHorizontal?: number;
	marginVertical?: number;
	marginTop?: number;
	marginBottom?: number;
	marginLeft?: number;
	marginRight?: number;
}

@Directive({
	selector: `[${SELECTOR}]`,
	exportAs: SELECTOR
})
export class InViewDirective {
	private _config = new Config({});
	@Output(SELECTOR)
	public event = new EventEmitter();
	private subs: Subscription;

	constructor(
		private trigger: TriggerService,
		public el: ElementRef
	) {
	}

	@Input(SELECTOR + '-config')
	set config(value) {
		forEach(value, (val, key) => {
			this._config[key] = val;
		});
	}

	get config():IConfig {
		return this._config
	}

	ngAfterViewInit() {
		defer(() => {
			this.subs = this.trigger.observable.subscribe(InViewDirective.handler.bind(this));
			InViewDirective.handler.call(this);
		});
	}

	ngOnDestroy() {
		this.subs.unsubscribe();
	}

	private isInViewPort():boolean {
		var rect = this.el.nativeElement.getBoundingClientRect();

		return (
			rect.top >= 0 - this._config.marginTop &&
			rect.left >= 0 - this._config.marginLeft &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + this._config.marginBottom &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth) + this._config.marginRight
		);
	}

	private static handler(this: InViewDirective):void {
		if (this.isInViewPort()) {
			this.event.emit();
			!this.config.infinite && this.subs.unsubscribe();
		}
	}
}

class Config implements IConfig {
	public marginTop = 0;
	public marginBottom = 0;
	public marginLeft = 0;
	public marginRight = 0;
	public infinite = false;

	constructor(value:IConfig) {
		forEach(value, (val, key) => {
			this[key] = val;
		});
	}

	set margin(value: number) {
		this.marginHorizontal = value;
		this.marginVertical = value;
	}

	set marginVertical(value: number) {
		this.marginTop = value;
		this.marginBottom = value;
	}

	set marginHorizontal(value: number) {
		this.marginLeft = value;
		this.marginRight = value;
	}
}