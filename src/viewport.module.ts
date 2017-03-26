import { NgModule } from '@angular/core';

import { DIRECTIVES } from './directives';
import { SERVICES } from './services';

@NgModule({
	imports: [
	],
	providers: [...SERVICES],
	declarations: [...DIRECTIVES],
	bootstrap: [],
	exports: [...DIRECTIVES]
})
export class ViewportModule {}