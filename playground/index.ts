import 'zone.js';
import 'reflect-metadata';

import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { ViewportModule, ScrollService } from '../dist';

@Component({
	selector: 'base',
	template: `
		<div vp-scrollable-content="#inserted-div" ></div>
	`,
	styles: [`
		:host {
			display: block;
			min-height: 300vh;
		}
	`]
})
class AppComponent {
	constructor(scroll: ScrollService) {
		console.log('app');
		scroll.onScrollEnd.subscribe(res => {
			console.log('scroll end', res);
		});
		scroll.onScrollStart.subscribe(res => {
			console.log('scroll start', res);
		});

		scroll.onScroll.subscribe(res => {
			console.log('scroll obs', res);
		});
	}
}

@NgModule({
	imports: [BrowserModule, ViewportModule],
	declarations: [AppComponent],
	bootstrap: [AppComponent]
})
class AppModule {}

const platform = platformBrowserDynamic();

platform.bootstrapModule(AppModule);