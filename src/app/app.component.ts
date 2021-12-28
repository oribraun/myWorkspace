import {Component, EventEmitter} from '@angular/core';
import {TestComponent} from './test.component';
import {Test2Component} from './test2.component';
import {Test3Component} from './test3.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    title = 'test-workspace';
    array = [];
    from = 0;
    to = 20;
    step = 10;
    maxItems = 30;
    fromHorizontal = 0;
    toHorizontal = 20;
    stepHorizontal = 10;
    maxItemsHorizontal = 30;
    settings: any = {
        firstComponent: TestComponent,
        firstComponentInputs: {},
        secondComponent: Test2Component,
        secondComponentInputs: {},
        thirdComponent: Test3Component,
        thirdComponentInputs: {},
        onDrag: new EventEmitter<any>(),
        onClick: new EventEmitter<any>(),
        css: {
            position: 'absolute',
            margin: ['0px', 'auto', '0px', 'auto'],
            top: '50px',
            left: 0,
            right: 0,
            bottom: 0,
            maxWidth: '500px',
            height: 'auto'
        }
    };

    obj: any = {};

    test = false;

    dsProjectRoomData: any = {
        text: 'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org',
        // url: 'https://abea.bike/about/directors',
        // url: 'https://www.apple.com/leadership/',
        url: '',
        showInIframe: false,
        isList: true,
        listHeader: 'People',
        listItemDefaultHeader: 'Person',
        listObjIndex: 1,
        listFirstItemIndex: 1,
        listSecondItemIndex: 2
    };
    dsProjectRoomObj: any = [
        {
            blockName: '',
            numColumns: 2,
            fields: [
                {label: 'not_a_signature', inputType: 'checkbox', description: '*not a signature description'},
                {label: 'non_english_text', inputType: 'checkbox'},
                {label: 'other', inputType: 'checkbox'},
                {label: 'reason', inputType: 'text', depend: 'other', dependOnValue: 1}
            ],
        },
        {
            blockName: 'name',
            blockDesc: '*Please ignore punctuations and cases (lower or upper)- as long as the name is correct. Please pay attention to possible mixups between first, middle and last names',
            numColumns: 2,
            fields: [
                {label: 'prefix', inputType: 'text', required: true},
                {label: 'first', inputType: 'text'},
                {label: 'middle', inputType: 'text'},
                // {label: 'email', inputType: 'email', required: true, pattern: '[^@\\s]+@[^@\\s]+\\.[^@\\s]+'},
            ],
        },
        {
            blockName: 'connections',
            numColumns: 4,
            fields: [
                {label: 'phones', inputType: 'text_list', required: true, description: '*phones description'},
                {label: 'faxes', inputType: 'text_list'},
                {label: 'comments', inputType: 'textarea'},
                {label: 'other', inputType: 'checkbox', value: 0},
                {label: 'type', inputType: 'select_multiple', selectOptions: ['one', 'two', 'three']},
                {label: 'to', inputType: 'text_list', listObj: [{label: 'name', required: true, inputType: 'text'}, {label: 'email', required: true, inputType: 'text'}]},
            ],
        }
    ];
    templateType = 1;
    mainCssObj = {};
    viewCssObj = {padding: '10px'};
    formCssObj = {padding: '0 10px'};

    changedsProjectRoomData() {
        this.dsProjectRoomData = {
            text: '',
            url: 'https://www.apple.com/leadership/',
            showInIframe: false,
        };
        this.templateType = 1;
    }
    change() {
        this.dsProjectRoomData = {
            text: '',
            url: 'https://abea.bike/about/directors',
            showInIframe: true,
        };
        this.templateType = 2;
    }
    changeTemplate() {
        this.templateType === 1 ? this.templateType = 2 : this.templateType = 1;
    }
    changedsProjectRoomObj() {
        this.dsProjectRoomObj[0].numColumns = 3;
        this.dsProjectRoomObj = [
            {
                blockName: '',
                numColumns: 2,
                fields: [
                    {label: 'not_a_signature', inputType: 'checkbox'},
                    {label: 'non_english_text', inputType: 'checkbox'},
                    {label: 'other', inputType: 'checkbox'},
                    {label: 'reason', inputType: 'text', depend: 'other', dependOnValue: 1}
                ],
            },
            {
                blockName: 'name',
                numColumns: 2,
                fields: [
                    {label: 'first_name', inputType: 'text', breakLine: true, center: true},
                    {label: 'last_name', inputType: 'text', fullLine: true},
                    {label: 'prefix', inputType: 'text', center: true, css: {width: '50%'}},
                ],
            },
            {
                blockName: 'connections',
                numColumns: 2,
                fields: [
                    {label: 'phones', inputType: 'text_list'},
                    {label: 'faxes', inputType: 'text_list'},
                    {label: 'comments', inputType: 'textarea'},
                    {label: 'other', inputType: 'checkbox', value: 0},
                    {label: 'type', inputType: 'select', selectOptions: ['one', 'two', 'three'], depend: 'other'}
                ],
            }
        ]
    }

    onDsProjectRoomChange(e) {
        console.log('e', e)
    }
    constructor(
    ) {
        this.settings.firstComponentInputs.test = this.test;
        this.settings.onDrag.subscribe((isDragging) => {
            console.log('isDragging', isDragging);
        });
        this.settings.onClick.subscribe((obj) => {
            if (obj.type === 'state') {
                alert(obj.msg);
            }
        });
        for (let i = 0; i < 10000; i++) {
            this.obj['field_' + i] = 'field_' + i + '_value';
        }
        this.addToArray();
    }

    onScrollBottom() {
        console.log('scrolled bottom', Date.now());
        if (this.array.length > this.to) {
            if (this.to - this.from >= this.maxItems - this.step) {
                this.from += this.step;
            }
            this.to += this.step;
        }
    }

    onScrollUp() {
        console.log('scrolled up', Date.now());
        if (this.from > 0) {
            if (this.to - this.from >= this.maxItems - this.step) {
                this.from -= this.step;
                // this.scroller.nativeElement.scrollTop += 100
            }
            this.to -= this.step;
        }
    }

    onScrollRight() {
        console.log('scrolled right', Date.now());
        if (this.array.length > this.toHorizontal) {
            if (this.toHorizontal - this.fromHorizontal >= this.maxItemsHorizontal - this.stepHorizontal) {
                this.fromHorizontal += this.stepHorizontal;
            }
            this.toHorizontal += this.stepHorizontal;
        }
    }

    onScrollLeft() {
        console.log('scrolled left', Date.now());
        if (this.fromHorizontal > 0) {
            if (this.toHorizontal - this.fromHorizontal >= this.maxItemsHorizontal - this.stepHorizontal) {
                this.fromHorizontal -= this.stepHorizontal;
                // this.scroller.nativeElement.scrollTop += 100
            }
            this.toHorizontal -= this.stepHorizontal;
        }
    }

    addToArray() {
        for (let i = 0; i < 10000; i++) {
            this.array.push(this.obj);
        }
    }

    click() {
        this.test = !this.test;
        this.settings.firstComponentInputs.test = this.test;
        this.settings = {...this.settings}
    }
}
