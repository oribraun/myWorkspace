# Dynamic Labeling Room

* structure of input obj
```angular2html
class DsProjectRoomBlock {
    blockName = ''; // the name of the block - will be presented as header in html
    blockDesc = ''; // the description of the block - will be presented under header in html
    blockWidth = ''; // width of the block in case we want two blocks to be in one row (must have next blocks complete width to 100%)
    numColumns: 2; // number of columns we want the fields to spread on
    fields: DsProjectRoomBlockField[] = []; // fields list inside the block
    isValid = true; // represent if the block is html valid
}

class DsProjectRoomBlockField {
    label = ''; // will be used for html input name and label text - short key l
    description = ''; // description that will show as text under the field - short key d
    value: any = ''; // value of the field - short key v
    inputType = ''; // html input type (text,number,email,checkbox,textarea,select,select_multiple,radio,text_list(must come with listObj) - short key iT
    required?: boolean; // html required - short key r
    pattern?: string; // html pattern - short key p
    listObj?: DsProjectRooomListObj[]; // for text-list type an array of DsProjectRooomListObj spread equal  on 100% - short key lO
    depend: string; // determine when field depend on another field based on label name - short key d
    dependOnValue: any; // determine the true value (number, boolean, string, any compare using ===) when a field depend on another field - short key dOV
    breakLine: boolean; // boolean to force break line between fields - short key bL
    fullLine: boolean; // boolean to force field to spread on full line - short key fL
    center: boolean; // boolean to force field to be center of column - short key c
    options: any[]; // represent string select, select_multiple, radio options - short key o
    css: any; // represent specific style to a string - short key c
}

class DsProjectRoomData {
    text = ''; // text we want to label
    url = ''; // url we want to label
    showInIframe = false; // boolean to determine if this url can be opened in an iframe - need to check in advance
    isList?: boolean; // adding and option to label a list of records
    listHeader?: string; // header for the list
    listHeaderFixed?: boolean; // mark list header as fixed
    listItemDefaultHeader?: string; // when isList is true this will be the default name presented for item in list
    listBlockIndex?: number; // this will be the block index from (dsProjectRoomObj) to present as header when filled
    listBlockFieldFirstIndex?: number; // this will be the first field index in listBlockIndex(the selected block index) to present as header when filled
    listBlockFieldSecondIndex?: number; // this will be the second field index in listBlockIndex(the selected block index) to present as header when filled

}

class DsProjectRooomListObj {
    label = ''; // will be used for html input name and label text
    description = ''; // description that will show as text under the field
    value: any = ''; // value of the field
    inputType = ''; // html input type (text,number,email,checkbox,textarea,select,select_multiple,radio,text_list(must come with listObj)
    required?: boolean; // html required
    pattern?: string; // html pattern
}
class OutputObj {
    obj: DsProjectRoomBlock | DsProjectRoomBlock[]; // full output obj to cache if needed
    cleanBlocks: any | any[]; // clean output obj with only full fields
    valid: boolean; // represent if the list of items or one item is valid in order to alert the user
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
dsProjectRoomBlocks: any = [
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
            {label: 'type', inputType: 'select', options: ['one', 'two', 'three'], depend: 'other'},
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
templateType = 1; // 1 for horizontal view, 2 for vertical view
initDragBasedOnViewTextSize = false // this will check the view text size and auto drag to minimize screen view
mainCssObj = {};
viewCssObj = {padding: '10px'};
formCssObj = {padding: '0 10px'};

onDsProjectRoomChange(e) {
    console.log('e', e)
}

<div class="home">
    <lib-dynamic-labeling-room
        [data]="dsProjectRoomData"
        [blocks]="dsProjectRoomBlocks"
        [templateType]="templateType"
        [initDragBasedOnViewTextSize]="initDragBasedOnViewTextSize"
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
