import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CheckDependPipe} from '../../pipes/check-depend.pipe';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
    selector: 'lib-select-multiple',
    templateUrl: './select-multiple.component.html',
    styleUrls: ['./select-multiple.component.css'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class SelectMultipleComponent implements OnInit {

    @Input() item: any;
    @Input() block: any;
    @Input() formSubmitted: boolean;
    @Input() labelHover: string;
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();

    labelDisappearedOptions = ['disappeared', 'small'];

    constructor(
        public checkDependPipe: CheckDependPipe
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
