import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import {BrowserModule} from '@angular/platform-browser';
import { DynamicTemplateComponent } from './dynamic-template.component';
import { DynamicComponentDirective } from './dynamic-component.directive';



@NgModule({
  declarations: [
    DynamicTemplateComponent,
    DynamicComponentDirective
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FontAwesomeModule
  ],
  exports: [DynamicTemplateComponent]
})
export class DynamicTemplateModule { }
