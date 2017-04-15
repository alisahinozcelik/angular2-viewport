import { Observable, Subject } from 'rxjs';

export function throttler<T>(observable: Observable<T>, throttleTime: number):Observable<T> {
	const subj: Subject<T> = new Subject();
	let timeout: number | boolean = false;
	let allowed = true;

	observable.subscribe(e => {
		timeout && clearTimeout(timeout as number);

		if (allowed) {
			allowed = false;
			subj.next(e);
		}

		timeout = setTimeout(handler, throttleTime);

		function handler() {
			allowed = true;
		}
	});

	return subj.share();
}