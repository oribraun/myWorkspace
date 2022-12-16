import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {CheckDependPipe} from '../../pipes/check-depend.pipe';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
    selector: 'lib-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.css'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class CheckboxComponent implements OnInit {

    private lastValue: number;
    @Input() item: any;
    @Input() block: any;
    @Input() formSubmitted: boolean;
    @Input() labelHover: string;
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

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

    @HostListener('click', ['$event'])
    click($event) {
        this.lastValue = this.item.value;
    }

    @HostListener('ngModelChange', ['$event'])
    modelChange($event) {
        if (!this.lastValue) {
            this.lastValue = 0;
        }
        if (this.lastValue !== this.item.value) {
            this.onClick.emit({item: this.item, lastValue: this.lastValue});
        }
    }

}
