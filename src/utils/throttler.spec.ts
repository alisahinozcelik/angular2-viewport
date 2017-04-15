import {} from "jasmine";
import { Observable } from "rxjs";
import { noop } from "lodash";

import { throttler } from "./throttler";

describe('Function: throttler', () => {
	it('should be defined as a function', () => {
		expect(throttler instanceof Function).toBe(true);
	});

	it('should be completed when the stream is over', done => {
		const obs = Observable.of(1);

		const throttled = throttler(obs, 100);

		throttled.subscribe({complete: () => {
			done();
		}});
	});

	it('shouldn\'t emit in throttling time', done => {
		const obs = Observable.timer(0, 100)
			.takeUntil(Observable.timer(500));
		
		const throttled = throttler(obs, 150);

		const subs = throttled.single().subscribe({
			error: () => {throw new Error('it shouldn\'t emit in throttling time, emitted more than once');},
			complete: () => {done();}
		});
	});
});