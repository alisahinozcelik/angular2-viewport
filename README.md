# Angular2 Viewport Module

#### *__Usage:__*
 
`npm install angular2-viewport --save`

```typescript
import { ViewportModule } from 'angular2-viewport';

@NgModule({
	imports: [
		...
		ViewportModule
	], ...
})
export class AppModule {}
```

## Directives

### In View `[vp-in-view]`
-------------------------------------------

Emits an event when element is in viewport

#### *__Usage:__*

```html
<div (vp-in-view)="handlerFunction()"></div>
```

#### *__Options:__*
```html
<div (vp-in-view)="handlerFunction()" [vp-in-view-config]="{infinite: true, margin: 300}"></div> 
```
| Property               | Type    | Default | Description                                             |
|:-----------------------|---------|---------|---------------------------------------------------------|
|**margin**              | number  | 0       | shortcut for 'marginHorizontal' & 'marginVertical'      |
|**marginHorizontal**    | number  | 0       | shortcut for 'marginLeft' & 'marginRight'               |
|**marginVertical**      | number  | 0       | shortcut for 'marginTop' & 'marginBottom'               |
|**marginTop**           | number  | 0       | Offset for calculation of top positon of the element    |
|**marginBottom**        | number  | 0       | Offset for calculation of bottom positon of the element |
|**marginLeft**          | number  | 0       | Offset for calculation of left positon of the element   |
|**marginRight**         | number  | 0       | Offset for calculation of right positon of the element  |
|**infinite**            | boolean | false   | Emit event on every enter to the viewport or only once  |

_______________________________________________

### Scrollable Content `[vp-scrollable-content]` (helper)
-------------------------------------------

Mark a scrollable element for triggering detection of **'in-view'** directives and emitting scroll events of **'ScrollService'**

#### *__Usage:__*

```html
<div vp-scrollable-content></div>
```

#### *__Dynamic Child:__*
If the scrolling target will be created dynamically, specify a selector for getting the target when view rendered
```html
<ion-scroll vp-scrollable-content=".scroll-content"></ion-scroll>
```
_______________________________________________

## Services
### ScrollService
-------------------------------------------

#### *__Usage:__*

```typescript
import { ScrollService } from 'angular2-viewport';

@Component({
	selector: 'a-component'
})
export class AComponent {

	constructor(scrollService: ScrollService) {
			scrollService.onScrollEnd.subscribe(e => {
				console.log('Yayy! Scrolling is ended');
			});
	}
```

#### *__Properties:__*
> **onScrollStart: Observable\<Event>**
> Emits when the scrolling is started on bound targets

> **onScrollEnd: Observable\<Event>**
> Emits when the scrolling is finished on bound targets

> **onScroll: Observable\<Event>**
> Throttled Scroll Event of bound targets

#### *__Methods:__*
> **bind(target: EventTarget): Function**
> Binds its listener to the event target to trigger checking position of in-view directive or for emiting its scroll events
> Returns the unbinding function

> **unbind(target: EventTarget):void**
> Removes its listener from the target

### TriggerService (helper)
-------------------------------------------

#### *__Usage:__*

```typescript
import { TriggerService } from 'angular2-viewport';

@Component({
	selector: 'a-component'
})
export class AComponent {

	constructor(triggerService: TriggerService) {
			...
	}
```

#### *__Methods:__*
> **bind(obs: Observable\<any>):Subscription**
> Bind an observable to trigger manually the detection of in-view directives
