import {
  ComponentFactoryResolver, ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges, Type,
  ViewContainerRef
} from '@angular/core';

@Directive({
  selector: '[libDynamicComponent]'
})
export class DynamicComponentDirective implements OnInit, OnChanges {

  @Input('libDynamicComponent') component: Type<any>;
  @Input() inputs: any;
  @Input() outputs: any;
  private componentRef: ComponentRef<any>;
  // @Output('appDynamicComponentChange') change = new EventEmitter<number>();
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent(): void {
    if (!this.component) {
      return;
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
    if (componentFactory) {
      if (this.componentRef) {
        this.viewContainerRef.clear();
      }
      this.componentRef = this.viewContainerRef.createComponent(componentFactory);
      this.loadInputs();
      // this.loadOutputs();
    }
    // componentRef.instance.disableWebsiteControl = true;

    // const selectors = this.options.map((o) => o.selector);
    // const index = selectors.indexOf(this.selector);
    // if (index > -1) {
    //     const component: any = this.options[index].component;
    //     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    //     this.viewContainerRef.createComponent(componentFactory);
    // }
  }

  loadInputs(): void {
    if (this.inputs) {
      for (const key in this.inputs) {
        // console.log('key', key);
        // console.log('this.inputs[key]', this.inputs[key]);
        this.componentRef.instance[key] = this.inputs[key];
      }
      this.componentRef.changeDetectorRef.detectChanges();
    }
  }

  loadOutputs(): void {
    if (this.outputs) {
      for (const key in this.outputs) {
        // console.log('key', key);
        // console.log('this.inputs[key]', this.inputs[key]);
        this.componentRef.instance[key].emit(this.outputs[key]);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.component && !changes.component.firstChange) {
      // console.log('loading............', this.component);
      this.loadComponent();
    }
    else {
      if (changes.inputs && !changes.inputs.firstChange) {
        this.loadInputs();
      }
      // if (changes.outputs && !changes.outputs.firstChange) {
      //     this.loadOutputs();
      // }
    }
    // this.loadInputs();
  }
}
