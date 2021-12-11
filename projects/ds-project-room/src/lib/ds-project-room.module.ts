import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DsProjectRoomComponent } from './ds-project-room.component';
import {SafePipe} from './safe.pipe';
import {HttpClientModule} from '@angular/common/http';



@NgModule({
    declarations: [
        DsProjectRoomComponent,
        SafePipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule
    ],
    exports: [
        DsProjectRoomComponent
    ]
})
export class DsProjectRoomModule { }
