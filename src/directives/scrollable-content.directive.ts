import { Directive, ElementRef, Input } from '@angular/core';

import { ScrollService } from '../services';

@Directive({
	selector: '[vp-scrollable-content]'
})
export class ScrollableContentDirective {
	@Input('vp-scrollable-content')
	protected targetSelector: string;
	protected scrollTarget: HTMLElement;

	constructor(
		protected el: ElementRef,
		protected scroll: ScrollService
	) {}

	ngAfterViewInit() {
		this.scrollTarget = this.targetSelector ? this.el.nativeElement.querySelector(this.targetSelector) : this.el.nativeElement;
		this.scroll.bind(this.scrollTarget);
	}

	ngOnDestroy() {
		this.scroll.unbind(this.scrollTarget);
	}
}