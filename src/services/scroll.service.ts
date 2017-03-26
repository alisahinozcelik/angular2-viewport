import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { last } from 'lodash';

const BUFFER_TIME = 100;

@Injectable()
export class ScrollService {
	private _subj: Subject<any> = new Subject();
	public observable: Observable<any>;
	private boundSet = new Set<EventTarget>();
	private handler: EventListener;

	constructor() {
		this.handler = ScrollService._handler.bind(this);
		this.observable = this._subj.bufferTime(BUFFER_TIME).filter(res => !!res.length).map(res => last(res)).share();
		this.bind(window);
	}

	/**
	 * Binds a scroll event to the event target
	 * to trigger checking position of in-view directive.
	 * 
	 * Returns unbinding function
	 */
	public bind(target: EventTarget): Function {
		if (!this.boundSet.has(target)) {
			target.addEventListener('scroll', this.handler);
			this.boundSet.add(target);
		}

		return this.unbind.bind(this, target);
	}

	public unbind(target: EventTarget) {
		this.boundSet.delete(target);
		target.removeEventListener('scroll', this.handler);
	}

	static _handler(this: ScrollService, e:Event):void {
		this._subj.next(e);
	}
}