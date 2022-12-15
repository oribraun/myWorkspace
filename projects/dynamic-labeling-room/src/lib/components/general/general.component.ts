import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CheckDependPipe} from '../../pipes/check-depend.pipe';
import {PatternPipe} from '../../pipes/pattern.pipe';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
    selector: 'lib-general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.css'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class GeneralComponent implements OnInit {

    @Input() item: any;
    @Input() block: any;
    @Input() formSubmitted: boolean;
    @Input() labelHover: string;
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();

    labelDisappearedOptions = ['disappeared', 'small'];

    constructor(
        public checkDependPipe: CheckDependPipe,
        public patternPipe: PatternPipe
    ) {
        if (this.labelDisappearedOptions.indexOf(this.labelHover) === -1) {
            this.labelHover = 'disappeared';
        }
    }

    ngOnInit(): void {
    }

    onNgModelChange() {
        this.ngModelChange.emit();
    }

    checkDepend(fields, item): boolean {
        return this.checkDependPipe.checkDepend(fields, item);
    }

}
