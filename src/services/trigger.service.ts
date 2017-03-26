import { Injectable } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';

import { ScrollService } from './scroll.service';

@Injectable()
export class TriggerService {
	private _subj = new Subject<{}>();
	public observable = this._subj.share();

	constructor(scroll: ScrollService) {
		scroll.observable.subscribe(() => {
			this._subj.next();
		});
	}

	public bind(obs: Observable<{}>):Subscription {
		return obs.subscribe(() => {
			this._subj.next();
		});
	}
}