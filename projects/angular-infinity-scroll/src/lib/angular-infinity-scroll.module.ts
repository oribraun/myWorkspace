import { NgModule } from '@angular/core';
import { AngularInfinityScrollDirective } from './angular-infinity-scroll.directive';



@NgModule({
  declarations: [
    AngularInfinityScrollDirective
  ],
  exports: [AngularInfinityScrollDirective]
})
export class AngularInfinityScrollModule { }
