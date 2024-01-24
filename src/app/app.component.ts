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
        text: '' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            'Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org' +
            '',
        // url: 'https://abea.bike/about/directors',
        // url: 'https://www.apple.com/leadership/',
        // url: '',
        showInIframe: false,
        isList: true,
        // only needed when isList is true
        listHeader: 'People', // this will be the headline for the list
        listHeaderFixed: true,
        listItemDefaultHeader: 'Person', // when isList is true this will be the default name presented for item in list
        listBlockIndex: 1, // this will be the block index from (dsProjectRoomObj) to present as header when filled
        listBlockFieldFirstIndex: 1, // this will be the first field index in listObjIndex(the selected block index) to present as header when filled
        listBlockFieldSecondIndex: 2 // this will be the second field index in listObjIndex(the selected block index) to present as header when filled
    };
    dsProjectRoomBlocks: any = [
        {
            blockName: '',
            numColumns: 2,
            fields: [
                {label: 'not_a_signature', inputType: 'checkbox', description: '*not a signature description'},
                {label: 'non_english_text', inputType: 'checkbox', value: 1},
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
            blockName: 'Radio',
            blockDesc: 'Desc',
            blockWidth: 50,
            numColumns: 1,
            fields: [
                {label: 'radio1', inputType: 'radio', options: ['one', 'two', 'three'], value: 'two'},
                {l: 'radio2', iT: 'radio', o: ['one', 'two', 'three'], v: 'two'},
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
                {label: 'type', inputType: 'select_multiple', options: ['one', 'two', 'three']},
                {label: 'to', inputType: 'text_list', listObj: [
                        {label: 'name', required: true, inputType: 'text', value: 'a'}, {label: 'email', required: true, inputType: 'text', value: 'b'}]
                },
            ],
        }
    ];
    templateType = 1;
    initDragBasedOnViewTextSize = true;
    enableHistory = true;
    mainCssObj = {};
    viewCssObj = {padding: '10px'};
    formCssObj = {padding: '0 10px'};

    buttonTry(obj) {
        console.log('obj', obj);
    }
    changedsProjectRoomData() {
        this.dsProjectRoomData = {
            // text: 'asdf',
            url: 'https://www.apple.com/leadership/',
            showInIframe: false,
        };
        this.templateType = 1;
    }
    change() {
        this.dsProjectRoomData = {
            // text: 'asdfasdf',
            url: 'https://abea.bike/about/directors',
            showInIframe: false,
        };
        this.templateType = 2;
    }
    changeTemplate() {
        this.templateType === 1 ? this.templateType = 2 : this.templateType = 1;
    }
    changedsProjectRoomBlocks() {
        this.dsProjectRoomBlocks[0].numColumns = 3;
        this.dsProjectRoomBlocks = [
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
                    {label: 'first_name', inputType: 'text', breakLine: true, center: true, required: true},
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
                    {label: 'type', inputType: 'select', options: ['one', 'two', 'three'], depend: 'other'}
                ],
            }
        ]
    }

    onDsProjectRoomChange(data) {
        console.log('data', data)
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
        this.presetObj();
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

    presetObj() {
        const dsProjectRoomBlocks = [
            [
                {
                    "blockName": "",
                    "numColumns": 2,
                    "fields": [
                        {
                            "label": "not_a_signature",
                            "inputType": "checkbox",
                            "description": "*not a signature description",
                            "value": 0
                        },
                        {
                            "label": "non_english_text",
                            "inputType": "checkbox",
                            "value": 0
                        },
                        {
                            "label": "other",
                            "inputType": "checkbox",
                            "value": 0
                        },
                        {
                            "label": "reason",
                            "inputType": "text",
                            "depend": "other",
                            "dependOnValue": 1,
                            "value": ""
                        }
                    ]
                },
                {
                    "blockName": "name",
                    "blockDesc": "*Please ignore punctuations and cases (lower or upper)- as long as the name is correct. Please pay attention to possible mixups between first, middle and last names",
                    "numColumns": 2,
                    "fields": [
                        {
                            "label": "prefix",
                            "inputType": "text",
                            "required": true,
                            "value": ""
                        },
                        {
                            "label": "first",
                            "inputType": "text",
                            "value": "ori"
                        },
                        {
                            "label": "middle",
                            "inputType": "text",
                            "value": ""
                        }
                    ]
                },
                {
                    "blockName": "connections",
                    "numColumns": 4,
                    "fields": [
                        {
                            "label": "phones",
                            "inputType": "text_list",
                            "required": true,
                            "description": "*phones description",
                            "value": []
                        },
                        {
                            "label": "faxes",
                            "inputType": "text_list",
                            "value": []
                        },
                        {
                            "label": "comments",
                            "inputType": "textarea",
                            "value": ""
                        },
                        {
                            "label": "other",
                            "inputType": "checkbox",
                            "value": 0
                        },
                        {
                            "label": "type",
                            "inputType": "select_multiple",
                            "options": [
                                "one",
                                "two",
                                "three"
                            ],
                            "value": "one"
                        },
                        {
                            label: 'to',
                            inputType: 'text_list',
                            listBlocks: [
                                {label: 'name', required: true, inputType: 'text'},
                                {label: 'email', required: true, inputType: 'text'}
                            ],
                            value: [
                                [
                                    {
                                        "label": "name",
                                        "value": "a"
                                    },
                                    {
                                        "label": "email",
                                        "value": "b"
                                    }
                                ]
                            ]
                        },
                    ]
                }
            ],
            [
                {
                    "blockName": "",
                    "numColumns": 2,
                    "fields": [
                        {
                            "label": "not_a_signature",
                            "inputType": "checkbox",
                            "description": "*not a signature description",
                            "value": 0
                        },
                        {
                            "label": "non_english_text",
                            "inputType": "checkbox",
                            "value": 0
                        },
                        {
                            "label": "other",
                            "inputType": "checkbox",
                            "value": 0
                        },
                        {
                            "label": "reason",
                            "inputType": "text",
                            "depend": "other",
                            "dependOnValue": 1,
                            "value": ""
                        }
                    ]
                },
                {
                    "blockName": "name",
                    "blockDesc": "*Please ignore punctuations and cases (lower or upper)- as long as the name is correct. Please pay attention to possible mixups between first, middle and last names",
                    "numColumns": 2,
                    "fields": [
                        {
                            "label": "prefix",
                            "inputType": "text",
                            "required": true,
                            "value": ""
                        },
                        {
                            "label": "first",
                            "inputType": "text",
                            "value": "gil"
                        },
                        {
                            "label": "middle",
                            "inputType": "text",
                            "value": ""
                        }
                    ]
                },
                {
                    "blockName": "connections",
                    "numColumns": 4,
                    "fields": [
                        {
                            "label": "phones",
                            "inputType": "text_list",
                            "required": true,
                            "description": "*phones description",
                            "value": []
                        },
                        {
                            "label": "faxes",
                            "inputType": "text_list",
                            "value": []
                        },
                        {
                            "label": "comments",
                            "inputType": "textarea",
                            "value": ""
                        },
                        {
                            "label": "other",
                            "inputType": "checkbox",
                            "value": 0
                        },
                        {
                            "label": "type",
                            "inputType": "select_multiple",
                            "options": [
                                "one",
                                "two",
                                "three"
                            ],
                            "value": ""
                        },
                        {
                            "label": "to",
                            "inputType": "text_list",
                            "listObj": [
                                {
                                    "label": "name",
                                    "required": true,
                                    "inputType": "text"
                                },
                                {
                                    "label": "email",
                                    "required": true,
                                    "inputType": "text"
                                }
                            ],
                            "value": []
                        }
                    ]
                }
            ]
        ];
        this.dsProjectRoomBlocks = [
            {
                blockName: '',
                numColumns: 2,
                fields: [
                    {label: 'not_a_signature', inputType: 'checkbox', description: '*not a signature description'},
                    {label: 'non_english_text', inputType: 'checkbox'},
                    {label: 'other', inputType: 'checkbox'},
                    {label: 'reason', inputType: 'text', depend: 'other', dependOnValue: 1},
                ],
            },
            {
                blockName: 'name',
                numColumns: 2,
                fields: [
                    {label: 'first_name', inputType: 'text', breakLine: true, center: true},
                    {label: 'last_name', inputType: 'text', fullLine: true},
                    {label: 'prefix', inputType: 'text', center: true, description: '*prefix description'},
                ],
            },
            {
                blockName: 'connections',
                numColumns: 2,
                fields: [
                    {label: 'phones', inputType: 'text_list', description: '*phones description'},
                    {label: 'faxes', inputType: 'text_list'},
                    {label: 'comments', inputType: 'textarea'},
                    {label: 'other', inputType: 'checkbox', value: 0},
                    {label: 'type', inputType: 'select', options: ['one', 'two', 'three'], depend: 'other', value: 'one'},
                    {label: 'type', inputType: 'select_multiple', options: ['one', 'two', 'three'], value: 'one'},
                    {
                        label: 'to',
                        inputType: 'text_list',
                        listBlocks: [
                            {label: 'name', required: true, inputType: 'text'},
                            {label: 'email', required: true, inputType: 'text'}
                        ],
                        value: [
                            [
                                {
                                    "label": "name",
                                    "value": "a"
                                },
                                {
                                    "label": "email",
                                    "value": "b"
                                }
                            ]
                        ]
                    }
                ],
            }
        ];
        this.dsProjectRoomBlocks = [
            // {
            //     blockName: 'First',
            //     numColumns: 2,
            //     blockWidth: 50,
            //     blockWidthToPixel: 990,
            //     fields: [
            //         {label: 'text', inputType: 'text', description: '*description', required: true},
            //         {label: 'number', inputType: 'number', description: '*description1', required: true},
            //         {label: 'comments', inputType: 'textarea', rows: 4, required: true, depend: 'checkbox', description: 'description4'},
            //         {label: 'select', inputType: 'select', options: ['one', 'two', 'three'], depend: 'other', description: 'description5', required: true},
            //     ],
            // },
            // {
            //     blockName: 'Second',
            //     numColumns: 2,
            //     blockWidth: 50,
            //     blockWidthToPixel: 990,
            //     fields: [
            //         {label: 'email', inputType: 'email', description: '*description2', required: true, pattern: '[^@\\s]+@[^@\\s]+\\.[^@\\s]+'},
            //         {label: 'checkbox', inputType: 'checkbox', description: '*description3', required: true},
            //         {label: 'select_multiple', inputType: 'select_multiple', options: ['one', 'two', 'three'], description: 'description6', required: true},
            //         {label: 'radio', inputType: 'radio', options: ['one', 'two', 'three'], description: 'description7', required: true},
            //     ],
            // },
            {
                blockName: '',
                numColumns: 4,
                fields: [
                    {label: 'text', inputType: 'text', description: '*description', required: true},
                    {label: 'number', inputType: 'number', description: '*description1', required: true},
                    {label: 'email', inputType: 'email', description: '*description2', required: true, pattern: '[^@\\s]+@[^@\\s]+\\.[^@\\s]+'},
                    {label: 'checkbox', inputType: 'checkbox', description: '*description3', required: true},
                    {label: 'comments', inputType: 'textarea', rows: 4, required: true, depend: 'checkbox', description: 'description4'},
                    {label: 'select', inputType: 'select', options: ['one', 'two', 'three'], depend: 'other', description: 'description5', required: true},
                    {label: 'select_multiple', inputType: 'select_multiple', options: ['one', 'two', 'three'], description: 'description6', required: true},
                    {label: 'radio', inputType: 'radio', options: ['one', 'two', 'three'], description: 'description7', required: true},
                    {label: 'to', inputType: 'text_list', description: 'description8', listBlocks: [
                            {label: 'name', required: true, inputType: 'text'},
                            {label: 'email', required: true, inputType: 'email', pattern: '[^@\\s]+@[^@\\s]+\\.[^@\\s]+'}
                        ],
                        // value: [
                        //     [
                        //         {label: 'name', value: 'name1'},
                        //         {label: 'email', value: 'email1'},
                        //         {label: 'email', value: 'email1'},
                        //     ],
                        //     [
                        //         {label: 'name', value: 'name1'},
                        //         {label: 'email', value: 'email2'}
                        //     ]
                        // ]
                    },
                    {label: 'phones', inputType: 'text_list', required: true, description: '*phones description'},


                    // // short key field example
                    // {l: 'radio2', iT: 'radio', o: ['one', 'two', 'three'], v: 'three'},
                    //
                    // // depend on value examples
                    // {label: 'other', inputType: 'checkbox', value: 0},
                    // {label: 'type', inputType: 'select', options: ['one', 'two', 'three'], depend: 'other', value: 'one'},
                    //
                    // {label: 'name', inputType: 'text'},
                    // {label: 'comments', inputType: 'textarea', value: 'some text', rows: 4, depend: 'name', dependValue: 'enable'},
                    //
                    // // break line example
                    // {label: 'first_name', inputType: 'text', breakLine: true, center: true},
                    //
                    // // full line example
                    // {label: 'last_name', inputType: 'text', fullLine: true},
                    //
                    // // css example and center
                    // {label: 'prefix', inputType: 'text', center: true, css: {width: '50%'}},
                ],
            },
            {
                blockName: 'name',
                blockDesc: '*Please ignore punctuations and cases (lower or upper)- as long as the name is correct. Please pay attention to possible mixups between first, middle and last names',
                blockWidth: 50,
                blockWidthToPixel: 990,
                numColumns: 2,
                fields: [
                    {label: 'prefix', inputType: 'text', required: true},
                    {label: 'first', inputType: 'text'},
                    {label: 'middle', inputType: 'text'},
                    // {label: 'email', inputType: 'email', required: true, pattern: '[^@\\s]+@[^@\\s]+\\.[^@\\s]+'},
                ],
            },
            {
                blockName: 'Radio',
                blockDesc: 'Desc',
                blockWidth: 50,
                blockWidthToPixel: 990,
                numColumns: 1,
                fields: [
                    {label: 'radio1', inputType: 'radio', options: ['one', 'two', 'three'], value: 'two'},
                    {l: 'radio2', iT: 'radio', o: ['one', 'two', 'three'], v: 'two'},
                ],
            },
        ]
        // this.dsProjectRoomBlocks = [ [ { "blockName": "header", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "sender_name", "description": "", "value": "Brooke Elser", "inputType": "text" }, { "label": "sender_email", "description": "", "value": "belser@quenchonline.com", "inputType": "text" }, { "label": "date", "description": "", "value": "Monday, October 7, 2019 9:23 AM", "inputType": "text" }, { "label": "to", "description": "", "value": "", "inputType": "text_list", "listBlocks": [ { "label": "name", "description": "", "value": "", "inputType": "text", "required": true }, { "label": "email", "description": "", "value": "", "inputType": "text", "required": true } ], "fullLine": true } ], "isValid": true, "numColumns": 3 }, { "blockName": "", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "signatures", "description": "", "value": "", "inputType": "text_list" } ], "isValid": true, "numColumns": 2 } ], [ { "blockName": "header", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "sender_name", "description": "", "value": "Erin Delisle", "inputType": "text" }, { "label": "sender_email", "description": "", "value": "erin.delisle@zoominfo.com", "inputType": "text" }, { "label": "date", "description": "", "value": "Monday, October 7, 2019 9:16 AM", "inputType": "text" }, { "label": "to", "description": "", "value": "", "inputType": "text_list", "listBlocks": [ { "label": "name", "description": "", "value": "", "inputType": "text", "required": true }, { "label": "email", "description": "", "value": "", "inputType": "text", "required": true } ], "fullLine": true } ], "isValid": true, "numColumns": 3 }, { "blockName": "", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "signatures", "description": "", "value": "", "inputType": "text_list" } ], "isValid": true, "numColumns": 2 } ], [ { "blockName": "header", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "sender_name", "description": "", "value": "Brooke Elser", "inputType": "text" }, { "label": "sender_email", "description": "", "value": "belser@quenchonline.com", "inputType": "text" }, { "label": "date", "description": "", "value": "Mon, Oct 7, 2019 at 9:07 AM", "inputType": "text" }, { "label": "to", "description": "", "value": "", "inputType": "text_list", "listBlocks": [ { "label": "name", "description": "", "value": "", "inputType": "text", "required": true }, { "label": "email", "description": "", "value": "", "inputType": "text", "required": true } ], "fullLine": true } ], "isValid": true, "numColumns": 3 }, { "blockName": "", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "signatures", "description": "", "value": "", "inputType": "text_list" } ], "isValid": true, "numColumns": 2 } ], [ { "blockName": "header", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "sender_name", "description": "", "value": "Hue Nguyen", "inputType": "text" }, { "label": "sender_email", "description": "", "value": "hnguyen@quenchonline.com", "inputType": "text" }, { "label": "date", "description": "", "value": "Friday, October 4, 2019 11:31 AM", "inputType": "text" }, { "label": "to", "description": "", "value": "", "inputType": "text_list", "listBlocks": [ { "label": "name", "description": "", "value": "", "inputType": "text", "required": true }, { "label": "email", "description": "", "value": "", "inputType": "text", "required": true } ], "fullLine": true } ], "isValid": true, "numColumns": 3 }, { "blockName": "", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "signatures", "description": "", "value": "", "inputType": "text_list" } ], "isValid": true, "numColumns": 2 } ], [ { "blockName": "header", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "sender_name", "description": "", "value": "Vinny Cortina", "inputType": "text" }, { "label": "sender_email", "description": "", "value": "vinny.cortina@zoominfo.com", "inputType": "text" }, { "label": "date", "description": "", "value": "Friday, October 4, 2019 11:25 AM", "inputType": "text" }, { "label": "to", "description": "", "value": "", "inputType": "text_list", "listBlocks": [ { "label": "name", "description": "", "value": "", "inputType": "text", "required": true }, { "label": "email", "description": "", "value": "", "inputType": "text", "required": true } ], "fullLine": true } ], "isValid": true, "numColumns": 3 }, { "blockName": "", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "signatures", "description": "", "value": "", "inputType": "text_list" } ], "isValid": true, "numColumns": 2 } ], [ { "blockName": "header", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "sender_name", "description": "", "value": "Erin Delisle", "inputType": "text" }, { "label": "sender_email", "description": "", "value": "erin.delisle@zoominfo.com", "inputType": "text" }, { "label": "date", "description": "", "value": "Fri, Oct 4, 2019 at 11:03 AM", "inputType": "text" }, { "label": "to", "description": "", "value": "", "inputType": "text_list", "listBlocks": [ { "label": "name", "description": "", "value": "", "inputType": "text", "required": true }, { "label": "email", "description": "", "value": "", "inputType": "text", "required": true } ], "fullLine": true } ], "isValid": true, "numColumns": 3 }, { "blockName": "", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "signatures", "description": "", "value": "", "inputType": "text_list" } ], "isValid": true, "numColumns": 2 } ], [ { "blockName": "header", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "sender_name", "description": "", "value": "Hue Nguyen", "inputType": "text" }, { "label": "sender_email", "description": "", "value": "hnguyen@quenchonline.com", "inputType": "text" }, { "label": "date", "description": "", "value": "Fri, Oct 4, 2019 at 11:00 AM", "inputType": "text" }, { "label": "to", "description": "", "value": "", "inputType": "text_list", "listBlocks": [ { "label": "name", "description": "", "value": "", "inputType": "text", "required": true }, { "label": "email", "description": "", "value": "", "inputType": "text", "required": true } ], "fullLine": true } ], "isValid": true, "numColumns": 3 }, { "blockName": "", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "signatures", "description": "", "value": "", "inputType": "text_list" } ], "isValid": true, "numColumns": 2 } ], [ { "blockName": "header", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "sender_name", "description": "", "value": "Brooke Elser", "inputType": "text" }, { "label": "sender_email", "description": "", "value": "belser@quenchonline.com", "inputType": "text" }, { "label": "date", "description": "", "value": "Thursday, October 3, 2019 2:16 PM", "inputType": "text" }, { "label": "to", "description": "", "value": "", "inputType": "text_list", "listBlocks": [ { "label": "name", "description": "", "value": "", "inputType": "text", "required": true }, { "label": "email", "description": "", "value": "", "inputType": "text", "required": true } ], "fullLine": true } ], "isValid": true, "numColumns": 3 }, { "blockName": "", "blockDesc": "", "blockWidth": "", "fields": [ { "label": "signatures", "description": "", "value": "", "inputType": "text_list" } ], "isValid": true, "numColumns": 2 } ] ]
        // this.dsProjectRoomData = { "text": "Hi Erin, \n \nWe do want to send our data with the e-mail domains, units, revenue for Vinny to append Zoom’s data on there. However, we do not want our customers data to be uploaded in any way to ZoomInfo. Can you please commit to this before I send you the data? \n \nThank you, \nHue \n \nFrom: Brooke Elser <belser@quenchonline.com> \n Sent: Monday, October 7, 2019 9:23 AM\n To: Erin DeLisle <erin.delisle@zoominfo.com>\n Cc: Hue Nguyen <hnguyen@quenchonline.com>; Vinny Cortina <vinny.cortina@zoominfo.com>; Lisa Guillaume <lguillaume@quenchonline.com>\n Subject: RE: Call re: Data Append \n \nHi Erin, \n \nI am not available but Hue is. Please proceed and I will hop on if possible. \n\nBrooke\n \nFrom: Erin DeLisle <erin.delisle@zoominfo.com> \n Sent: Monday, October 7, 2019 9:16 AM\n To: Brooke Elser <belser@quenchonline.com>\n Cc: Hue Nguyen <hnguyen@quenchonline.com>; Vinny Cortina <vinny.cortina@zoominfo.com>; Lisa Guillaume <lguillaume@quenchonline.com>\n Subject: Re: Call re: Data Append \n \nCAUTION: This email originated from outside of the organization. Do not click links or open attachments unless you recognize the sender and know the content is safe. \n \nHi Brooke & Team - I am just back in the office today. I think that Vinny must have meant 3pm EST today...so can we plan on that? \n \nThanks, \nErin \n \nOn Mon, Oct 7, 2019 at 9:07 AM Brooke Elser <belser@quenchonline.com> wrote: \nGood morning, \n \nWe need to get this straightened out ASAP. Are you able to connect with us sometime today? This is a priority for our team. \n \nThanks, \nBrooke \n \n \nBrooke Elser\n Director, Growth Marketing\n phone: 610.930.2370\n web: http://quenchwater.com\n NYSE: WAAS \n \n \n \n \nFrom: Hue Nguyen <hnguyen@quenchonline.com> \n Sent: Friday, October 4, 2019 11:31 AM\n To: Vinny Cortina <vinny.cortina@zoominfo.com>; Erin DeLisle <erin.delisle@zoominfo.com>\n Cc: Brooke Elser <belser@quenchonline.com>; Lisa Guillaume <lguillaume@quenchonline.com>\n Subject: RE: Call re: Data Append \n \nHi Vinny, \n \nIs now a good time to hop on a call with you now? My number is 610.930.9481 \n \nThanks, \nHue \n \nFrom: Vinny Cortina <vinny.cortina@zoominfo.com> \n Sent: Friday, October 4, 2019 11:25 AM\n To: Erin DeLisle <erin.delisle@zoominfo.com>\n Cc: Hue Nguyen <hnguyen@quenchonline.com>; Brooke Elser <belser@quenchonline.com>; Lisa Guillaume <lguillaume@quenchonline.com>\n Subject: Re: Call re: Data Append \n \n CAUTION: This email originated from outside of the organization. Do not click links or open attachments unless you recognize the sender and know the content is safe. \n \nHi all, \n \n11am ET, 2pm ET, 3pm ET all work for me. \n \nBest, \n \n \n \nOn Fri, Oct 4, 2019 at 11:03 AM Erin DeLisle <erin.delisle@zoominfo.com> wrote: \nHi Hue, Brooke, and Lisa, \n \nI am out of the office today. We definitely should set up a call and I think that you all should work directly with our data team. \n \nI’ve copied Vinny on this email. Vinny do you have any openings today or Monday to connect with the Quench team on the location data project we’ve been working on? can you propose a few times that work for you? \n \nThank you! \n \nErin \n \nOn Fri, Oct 4, 2019 at 11:00 AM Hue Nguyen <hnguyen@quenchonline.com> wrote: \nHi Erin, \n \nJust following up to see if you have received our email below. Let us know if we can hop on a call to align the data. We need to get this project done ASAP. \n \nThanks, \nHue \n \nFrom: Brooke Elser <belser@quenchonline.com> \n Sent: Thursday, October 3, 2019 2:16 PM\n To: Erin DeLisle <erin.delisle@zoominfo.com>\n Cc: Hue Nguyen <hnguyen@quenchonline.com>; Lisa Guillaume <lguillaume@quenchonline.com>\n Subject: Call re: Data Append \n \nHi Erin, \n \nWe were looking at the dataset, and we have 85% of our records appended with e-mail domains. However, out of the 27K records, we are unable to match about 11K of them to domains. This seemed odd, so we did some basic searches to see if we had just the general companies in our data that you had in yours and some were missing—we didn’t have them in our data set at all but they were in yours. We also noticed that some of the domains provided were odd—see the State Farm Insurance one as an example. \n \nCan we have a call to align? \n \nThanks, \nBrooke \n \nBrooke Elser\n phone: 610.930.2370\n web: http://quenchwater.com\n NYSE: WAAS \n \n \n \n \n \n-- \nErin DeLisle \n Senior Account Executive, Team Lead\n 38 West Fulton St. | Grand Rapids, MI | 49503\n o: 617.826.2450 | \n www.zoominfo.com \n \n \n \n \n \n \n\n \n \n-- \nVinny Cortina \n Associate Sales Engineer\n 170 Data Drive | Waltham, MA | 02451\n o: 617.826.2082 | \n www.zoominfo.com \n \n \n \n \n \n\n \n \n-- \nErin DeLisle \n Senior Account Executive, Team Lead\n 38 West Fulton St. | Grand Rapids, MI | 49503\n o: 617.826.2450 | \n www.zoominfo.com", "url": "", "showInIframe": false, "isList": true, "listHeader": "Threads", "listItemDefaultHeader": "Thread", "listBlockIndex": 0, "listBlockFieldFirstIndex": 0 }

        // this.dsProjectRoomData = { "text": "Jordan Johnson | Golf Course Assistant\nValleywood Golf Course\n952.953.2325 | jjohnson@cityofapplevalley.org", "url": "", "showInIframe": false };
        // this.dsProjectRoomBlocks = [ { "blockName": "", "blockDesc": "", "fields": [ { "label": "not_a_signature", "description": "", "value": 1, "inputType": "checkbox" }, { "label": "non_english_text", "description": "", "value": 1, "inputType": "checkbox" }, { "label": "other", "description": "", "value": 1, "inputType": "checkbox" }, { "label": "reason", "description": "", "value": "", "inputType": "text", "depend": "other", "dependOnValue": 1 } ], "isValid": true, "numColumns": 4 }, { "blockName": "name", "blockDesc": "", "fields": [ { "label": "prefix", "description": "", "value": "p", "inputType": "text" }, { "label": "first", "description": "", "value": "Jordan", "inputType": "text" }, { "label": "middle", "description": "", "value": "Middle", "inputType": "text" }, { "label": "last", "description": "", "value": "Johnson", "inputType": "text" }, { "label": "suffix", "description": "", "value": "s", "inputType": "text" }, { "label": "credentials", "description": "", "value": "test", "inputType": "text" }, { "label": "credentials_ids", "description": "this can be ignored", "value": "ci", "inputType": "text" } ], "isValid": true, "numColumns": 4 }, { "blockName": "title & company", "blockDesc": "", "fields": [ { "label": "title", "description": "", "value": "Golf Course Assistant", "inputType": "text" }, { "label": "company", "description": "", "value": "Valleywood Golf Course", "inputType": "text" }, { "label": "company_ids", "description": "", "value": "comi", "inputType": "text" }, { "label": "copyrights", "description": "", "value": "copy", "inputType": "text" }, { "label": "department", "description": "", "value": "sep", "inputType": "text" }, { "label": "slogan", "description": "", "value": "slo", "inputType": "text" } ], "isValid": true, "numColumns": 4 }, { "blockName": "location", "blockDesc": "", "fields": [ { "label": "address", "description": "", "value": "add", "inputType": "text" }, { "label": "department", "description": "", "value": "sep1", "inputType": "text" }, { "label": "city", "description": "", "value": "city", "inputType": "text" }, { "label": "state", "description": "", "value": "dtate", "inputType": "text" }, { "label": "zip", "description": "", "value": "zip", "inputType": "text" }, { "label": "country", "description": "", "value": "country", "inputType": "text" } ], "isValid": true, "numColumns": 4 }, { "blockName": "connections", "blockDesc": "", "fields": [ { "label": "phones", "description": "", "value": [ "952.953.2325" ], "inputType": "text_list" }, { "label": "faxes", "description": "", "value": [ "095588556" ], "inputType": "text_list" }, { "label": "emails", "description": "", "value": [ "jjohnson@cityofapplevalley.org" ], "inputType": "text_list" }, { "label": "urls", "description": "", "value": [ "www.ynet.co.il" ], "inputType": "text_list" }, { "label": "filtered_urls", "description": "", "value": [ "ynet.co.il" ], "inputType": "text_list" }, { "label": "twitter", "description": "", "value": [ "twitt" ], "inputType": "text_list" }, { "label": "skype", "description": "", "value": [ "skype" ], "inputType": "text_list" } ], "isValid": true, "numColumns": 4 } ];
    }
}
