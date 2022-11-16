import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicLabelingRoomComponent } from './dynamic-labeling-room.component';
import {SafePipe} from './safe.pipe';



@NgModule({
    declarations: [
        DynamicLabelingRoomComponent,
        SafePipe
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        DynamicLabelingRoomComponent
    ]
})
export class DynamicLabelingRoomModule { }
