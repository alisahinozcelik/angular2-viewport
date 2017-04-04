import { Directive, ElementRef, Input } from '@angular/core';

import { ScrollService } from '../services';

@Directive({
	selector: '[vp-scrollable-content]'
})
export class ScrollableContentDirective {
	@Input('vp-scrollable-content')
	private targetSelector: string;
	private scrollTarget: HTMLElement;

	constructor(
		private el: ElementRef,
		private scroll: ScrollService
	) {}

	ngAfterViewInit() {
		this.scrollTarget = this.targetSelector ? this.el.nativeElement.querySelector(this.targetSelector) : this.el.nativeElement;
		this.scroll.bind(this.scrollTarget);
	}

	ngOnDestroy() {
		this.scroll.unbind(this.scrollTarget);
	}
}