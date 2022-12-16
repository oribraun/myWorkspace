import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {CheckDependPipe} from '../../pipes/check-depend.pipe';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
    selector: 'lib-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.css'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class SelectComponent implements OnInit {

    private lastValue: string = '';
    @Input() item: any;
    @Input() block: any;
    @Input() formSubmitted: boolean;
    @Input() labelHover: string;
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

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

    @HostListener('change', ['$event'])
    change($event) {
        this.lastValue = this.item.value;
    }

    @HostListener('ngModelChange', ['$event'])
    modelChange($event) {
        if (!this.lastValue) {
            this.lastValue = '';
        }
        this.onChange.emit({item: this.item, lastValue: this.lastValue});
    }

}
