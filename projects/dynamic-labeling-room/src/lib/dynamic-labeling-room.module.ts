import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicLabelingRoomComponent } from './dynamic-labeling-room.component';
import {SafePipe} from './safe.pipe';
import { TextareaComponent } from './components/textarea/textarea.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { CheckDependPipe } from './pipes/check-depend.pipe';
import { PrettyLabelPipe } from './pipes/pretty-label.pipe';
import { GeneralComponent } from './components/general/general.component';
import { SelectComponent } from './components/select/select.component';
import { SelectMultipleComponent } from './components/select-multiple/select-multiple.component';
import { RadioComponent } from './components/radio/radio.component';
import { TextListComponent } from './components/text-list/text-list.component';
import { PatternPipe } from './pipes/pattern.pipe';



@NgModule({
    declarations: [
        DynamicLabelingRoomComponent,
        SafePipe,
        TextareaComponent,
        CheckboxComponent,
        CheckDependPipe,
        PrettyLabelPipe,
        GeneralComponent,
        SelectComponent,
        SelectMultipleComponent,
        RadioComponent,
        TextListComponent,
        PatternPipe,
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        DynamicLabelingRoomComponent
    ],
    providers: [
        CheckDependPipe,
        PrettyLabelPipe,
        PatternPipe
    ]
})
export class DynamicLabelingRoomModule { }
