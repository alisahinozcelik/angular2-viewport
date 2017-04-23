import { TestBed, inject } from '@angular/core/testing';
import { Subject, Observable, Subscription } from 'rxjs';

import { ScrollService } from "./scroll.service";

describe("Service: ScrollService", () => {
	let subsArr:Subscription[];

	beforeAll(() => {
		document.body.style.minHeight = "3000vh";
	});

	beforeEach(() => {
		subsArr = [];

		window.scrollTo(0, 0);

		TestBed.configureTestingModule({
			providers: [ScrollService]
		});

		spyOn(console, 'warn');
	});

	it("onScroll should emit on scroll", done => {
		inject([ScrollService], (scrollService: ScrollService) => {
			const subs = scrollService.onScroll.subscribe(res => {
				done();
			});
			windowScrollTo(1000);
			subsArr.push(subs);
		})();
	});

	it("onScroll should emit 3 times in 250 seconds", done => {
		inject([ScrollService], (scrollService: ScrollService) => {

			var emitted = 0;
			var scroller = Observable.interval(10).take(25);

			const subs1 = scroller.subscribe({
				next: e => {
					windowScrollTo((e + 1) * 100);
				},
				complete: () => {
					expect(emitted).toBe(3);
					done();
				}
			});

			const subs2 = scrollService.onScroll.subscribe(() => {emitted++;});

			subsArr.push(subs1, subs2);
		})();
	});

	it("onScrollStart should emit only once when the scrolling started until scrolling ends", done => {
		inject([ScrollService], (scrollService: ScrollService) => {

			var emitted = 0;
			var scrollerInvoked = 0;
			var scroller = Observable.interval(10)
				.take(30)
				.takeUntil(scrollService.onScrollStart.skip(1));

			const subs1 = scroller.subscribe({
				next: e => {
					scrollerInvoked++;
					windowScrollTo((e + 1) * 100);
				},
				complete: () => {
					expect(emitted).toBe(1);
					expect(scrollerInvoked).toBe(30);
					done();
				}
			});

			const subs2 = scrollService.onScrollStart.subscribe(() => {emitted++;});

			subsArr.push(subs1, subs2);
		})();
	});

	it("onScrollEnd should emit only once when the scrolling ends", done => {
		inject([ScrollService], (scrollService: ScrollService) => {

			var scrollerInvoked = 0;
			var scroller = Observable.interval(10)
				.take(30)
				.takeUntil(scrollService.onScrollEnd);

			const subs1 = scroller.subscribe(e => {
				scrollerInvoked++;
				windowScrollTo((e + 1) * 100);
			});

			const subs2 = scrollService.onScrollEnd.first().subscribe(() => {
				expect(scrollerInvoked).toBe(30);
				done();
			});

			subsArr.push(subs1, subs2);
		})();
	});

	it("bind should listen the scroll event of bound element", done => {
		inject([ScrollService], (scrollService: ScrollService) => {

			var element = createScrollElement();

			scrollService.bind(element);

			const subs = scrollService.onScroll.subscribe(res => {
				done();
			});

			scrollTo(element, 500);

			subsArr.push(subs);
		})();
	});

	it("bind should warn while trying to bind more than one", done => {
		inject([ScrollService], (scrollService: ScrollService) => {

			var element = createScrollElement();

			scrollService.bind(element);
			scrollService.bind(element);

			expect(console.warn).toHaveBeenCalled();
			done();
		})();
	});

	it("bind should throw error if the target is not an html element", done => {
		inject([ScrollService], (scrollService: ScrollService) => {

			expect(() => {scrollService.bind(undefined);}).toThrowError();
			done();
		})();
	});

	it("unbind should stop listening the scroll event of unbound element", done => {
		inject([ScrollService], (scrollService: ScrollService) => {

			let emitted = 0;
			const element = createScrollElement();

			scrollService.bind(element);

			var scroller = Observable.interval(200).take(3);

			const subs1 = scrollService.onScroll.subscribe(e => {emitted++;});

			const subs2 = scroller.first().subscribe(() => {scrollService.unbind(element);});

			const subs3 = scroller.subscribe({
				next: e => {scrollTo(element, (e+1) * 500);},
				complete: () => {
					expect(emitted).toBe(1);
					done();
				}
			});

			subsArr.push(subs1, subs2, subs3);
		})();
	});

	it("unbind should warn while trying to unbind a non-bound target", done => {
		inject([ScrollService], (scrollService: ScrollService) => {

			var element = createScrollElement();

			scrollService.unbind(element);

			expect(console.warn).toHaveBeenCalled();
			done();
		})();
	});

	afterEach(() => {
		subsArr.forEach(sub => {
			sub.unsubscribe();
		});
	});

	afterAll(() => {
		document.body.style.minHeight = "initial";
	});

	function createScrollElement(): HTMLDivElement {
		var element = document.createElement('div');
		var child = document.createElement('div');

		element.style.overflow = "scroll";
		element.style.height = "500px";
		child.style.height = "3000vh";

		element.appendChild(child);
		document.body.appendChild(element);

		return element;	
	}

	function windowScrollTo(y: number) {
		scrollTo(window, y);
	}

	function scrollTo(element: EventTarget | Element, y:number) {
		if (element === window) {
			(element as Window).scrollTo(0, y);
		}
		else {
			(element as Element).scrollTop = y;
		}

		element.dispatchEvent(new Event('scroll'));
	}
});
