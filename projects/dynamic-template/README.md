# DynamicTemplate

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

## Code scaffolding

Run `ng generate component component-name --project dynamic-template` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project dynamic-template`.
> Note: Don't forget to add `--project dynamic-template` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build dynamic-template` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build dynamic-template`, go to the dist folder `cd dist/dynamic-template` and run `npm publish`.

## Running unit tests

Run `ng test dynamic-template` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

#example use

```json
const settings = {
    firstComponent: 'some component',
    secondComponent: 'some component',
    thirdComponent: 'some component',
    onDrag: new EventEmitter(), // emit when drag state change
    css: {
      position: 'absolute',
      margin: ['px','0px','0px','0px'],
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: 'auto'
    },
    icons: {
      expand: '',
      cog: '',
      syncAlt: '',
      save: '',
      retweet: '',
      columns: '',
    }
  };
```
  
<lib-dynamic-template [settings]="settings"></lib-dynamic-template>

each time drag started class disable-mobile-refresh injected to body element
in order to prevent iframe events behavior:

body.disable-mobile-refresh {
    overscroll-behavior-y: contain;
}
