import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {CheckDependPipe} from '../../pipes/check-depend.pipe';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
    selector: 'lib-textarea',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.css'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class TextareaComponent implements OnInit {

    @Input() item: any;
    @Input() block: any;
    @Input() formSubmitted: boolean;
    @Input() labelHover: string;
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() onKeyDown: EventEmitter<any> = new EventEmitter<any>();

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

    @HostListener('keydown', ['$event'])
    keyDown($event) {
        const lastValue = $event.target.value;
        this.onKeyDown.emit({item: this.item, lastValue});
    }

}
