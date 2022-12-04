# Dynamic Labeling Room

* structure of input obj
```angular2html
export class Block {
    blockName = '';
    blockDesc = '';
    numColumns: 2;
    fields: BlockField[] = [];
}

export class BlockField {
    label = '';
    description = '';
    value: any = '';
    inputType = '';
    depend = '';
    dependOnValue: any = '';
    breakLine = false;
    fullLine = false;
    center = false;
    selectOptions = [];
    css = {};

    constructor(obj) {
        if (obj) {
            for (const key in obj) {
                if (obj[key]) {
                    this[key] = obj[key];
                }
            }
        }
    }
}

export class Data {
    text = '';
    url = '';
    showInIframe = false;

    constructor(obj) {
        if (obj) {
            for (const key in obj) {
                if (obj[key]) {
                    this[key] = obj[key];
                }
            }
        }
    }
}
```

* example use
```angular2html
<style>
    .home {
        box-shadow: 0 0 5px #ccc;
        height: 500px;
    }
</style>
dsProjectRoomData = {
    text: '',
    url: 'https://polkadotmama.org/board-of-directors/',
    // url: 'https://www.apple.com/leadership/',
    showInIframe: true,
    isList: true,
    // only needed when isList is true
    listHeader: 'People', // this will be the headline for the list
    listHeaderFixed?: boolean; // will set records header to be fixed
    listItemDefaultHeader: 'Person', // when isList is true this will be the default name presented for item in list
    listObjIndex: 1, // this will be the block index from (dsProjectRoomObj) to present as header when filled
    listFirstItemIndex: 1, // this will be the first field index in listObjIndex(the selected block index) to present as header when filled
    listSecondItemIndex: 2 // this will be the second field index in listObjIndex(the selected block index) to present as header when filled
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
            {label: 'type', inputType: 'select', selectOptions: ['one', 'two', 'three'], depend: 'other'}
        ],
    }
];
templateType = 1;
mainCssObj = {};
viewCssObj = {padding: '10px'};
formCssObj = {padding: '0 10px'};

onDsProjectRoomChange(e) {
    console.log('e', e)
}

<div class="home">
    <lib-dynamic-labeling-room
        [data]="dsProjectRoomData"
        [obj]="dsProjectRoomObj"
        [templateType]="templateType"
        [mainCssObj]="mainCssObj"
        [viewCssObj]="viewCssObj"
        [formCssObj]="formCssObj"
        (onChange)="onDsProjectRoomChange($event)"
    ></lib-dynamic-labeling-room>
</div>
```

# change full style
* if you want to control the full design of the component you can add this less structure to your parent style
* this example change inputs background to red.
```angular2html
&::ng-deep {
        .dynamic-labeling-room {
            .labeling {
                .labeling-overflow {}
                &-block {
                    &-row {
                        &-column {
                            &-header {}
                            &-body {
                                &-item {
                                    &-box {
                                        &-input {
                                            input, textarea, select {
                                                background: red;
                                                &[value]:not([value=""]) ~ .labeling-block-row-column-body-item-box-input-label-hover {}
                                            }
                                            &-label {
                                                &-hover {}
                                                &-plus {}
                                            }
                                            &-description {}
                                            &-list-item {
                                                &-minus {}
                                            }
                                        }

                                        &-break-line {}
                                        &-full-line {}
                                        &-center {}
                                    }

                                    &-checkbox .labeling-block-row-column-body-item-box {
                                        &-input {
                                            input {}

                                            &-label {}
                                        }
                                    }

                                    &-col {}
                                }
                            }
                        }
                    }
                }
            }
            .view {
                .iframe-wrapper {
                    iframe {}
                    .dragging {}
                    .iframe-loader-wrapper {
                        .iframe-loader {
                            div {}
                        }
                    }
                }
                &-with-url {}
            }
            .horizontal-drag {
                &-top {}
                &-bottom {}
            }
            .vertical-drag {
                &-left {}
                &-right {}
            }
            .floating-template-button {
                .lds-hourglass {
                    &.animate {}
                }
            }
        }
    }
```
