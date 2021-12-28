import {BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DynamicTemplateModule } from 'projects/dynamic-template/src/lib/dynamic-template.module';
import { DynamicLabelingRoomModule } from 'projects/dynamic-labeling-room/src/lib/dynamic-labeling-room.module';
// import { DynamicTemplateModule } from 'angular-dynamic-template';

import { AngularInfinityScrollModule } from 'projects/angular-infinity-scroll/src/lib/angular-infinity-scroll.module';
import { ScrollingModule} from '@angular/cdk/scrolling';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './test.component';
import { Test2Component } from './test2.component';
import { Test3Component } from './test3.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    Test2Component,
    Test3Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DynamicTemplateModule,
    DynamicLabelingRoomModule,
    AngularInfinityScrollModule,
    ScrollingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
