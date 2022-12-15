import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CheckDependPipe} from '../../pipes/check-depend.pipe';
import {PatternPipe} from '../../pipes/pattern.pipe';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
    selector: 'lib-text-list',
    templateUrl: './text-list.component.html',
    styleUrls: ['./text-list.component.css'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class TextListComponent implements OnInit {

    @Input() item: any;
    @Input() block: any;
    @Input() formSubmitted: boolean;
    @Input() required: boolean;
    @Input() labelHover: string;
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() removeItem: EventEmitter<any> = new EventEmitter<any>();
    @Output() addItem: EventEmitter<any> = new EventEmitter<any>();

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

    trackByFn(index: any, item: any): number {
        return index;
    }

    getObjKeysLength(listBlocks): number {
        return Object.keys(listBlocks).length;
    }

    onRemoveItemFromList(item, i) {
        this.removeItem.emit({item, i});
        setTimeout(() => {
            this.onNgModelChange();
        });
    }

    onAddItemToList(item) {
        this.addItem.emit(item);
        setTimeout(() => {
            this.onNgModelChange();
        });
    }

}
