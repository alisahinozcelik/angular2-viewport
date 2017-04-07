import { Directive, ElementRef, Input } from '@angular/core';

import { ScrollService } from '../services';

@Directive({
	selector: '[vp-scrollable-content]'
})
export class ScrollableContentDirective {
	@Input('vp-scrollable-content')
	private targetSelector: string;
	private scrollTargets: HTMLElement[] = [];

	constructor(
		private el: ElementRef,
		private scroll: ScrollService
	) {}

	private ngAfterViewInit():void {

		if (this.targetSelector) {
			const list: HTMLElement[] = Array.prototype.slice.call(this.el.nativeElement.querySelectorAll(this.targetSelector));

			this.scrollTargets.push(...list);
			!list.length && this.scrollTargets.push(this.el.nativeElement);
		}
		else {
			this.scrollTargets.push(this.el.nativeElement);
		}

		this.scrollTargets.forEach(el => {
			this.scroll.bind(el);
		});
	}

	private ngOnDestroy():void {
		this.scrollTargets.forEach(el => {
			this.scroll.unbind(el);
		});
	}
}