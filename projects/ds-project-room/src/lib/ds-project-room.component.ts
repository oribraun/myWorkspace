import {
    AfterViewInit,
    Component, DoCheck, ElementRef, EventEmitter,
    HostListener,
    Inject, Input,
    OnChanges,
    OnInit, Output,
    SimpleChanges,
    ViewChild, ViewEncapsulation
} from '@angular/core';
import {DOCUMENT, KeyValue} from '@angular/common';

@Component({
    selector: 'lib-ds-project-room',
    templateUrl: './ds-project-room.component.html',
    styleUrls: ['./ds-project-room.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class DsProjectRoomComponent implements OnInit, AfterViewInit, OnChanges {

    @ViewChild('ds_project_room') dsProjectRoom: any;
    @ViewChild('iframe') iframe: any;
    @ViewChild('f') form: any;
    private document: Document;
    public dragStarted = false;
    public resetViewAnimate = false;
    public changeTemplateAnimation = false;
    public changeTemplateAnimationTimeout;
    public currentDrag;
    public verticalDrag: any = {
        version: 1,
        // all numbers are percent values
        view: {
            mousedown: false,
            height: '',
            top: 0,
            bottom: 50,
            right: 0,
            left: 0,
            startPos: null,
            type: null,
            onMove: {
                currentPos: 'top',
                top: false,
                bottom: 'bottom',
                left: false,
                right: false,
            }
        },
        labeling: {
            mousedown: false,
            height: '',
            top: 50,
            bottom: 0,
            right: 0,
            left: 0,
            startPos: null,
            type: null,
            onMove: {
                currentPos: 'bottom',
                top: 'top',
                bottom: false,
                left: false,
                right: false,
            }
        },
        minTop: 0,
        maxTop: 100,
        minLeft: 0,
        maxLeft: 100
    };
    public horizontalDrag: any = {
        version: 2,
        // all numbers are percent values
        view: {
            mousedown: false,
            height: '',
            top: 0,
            bottom: 0,
            right: 0,
            left: 50,
            marginLeft: 0,
            marginRight: 0,
            startPos: null,
            type: null,
            onMove: {
                currentPos: 'right',
                top: false,
                bottom: false,
                left: 'left',
                right: false,
            }
        },
        labeling: {
            mousedown: false,
            height: '',
            top: 0,
            bottom: 0,
            right: 50,
            left: 0,
            marginLeft: 0,
            marginRight: 0,
            startPos: null,
            type: null,
            onMove: {
                currentPos: 'left',
                top: false,
                bottom: false,
                left: false,
                right: 'right',
            }
        },
        minTop: 0,
        maxTop: 100,
        minLeft: 0,
        maxLeft: 100
    };
    public iframeLoading = false;
    public mainList = [];
    public listCurrentIndex = 0;
    public listObj: any;
    @Input() mainCssObj;
    @Input() viewCssObj;
    @Input() formCssObj;
    @Input() templateType = 1;
    @Input() data: DsProjectRoomData = {
        // text: 'signature',
        // url: 'https://polkadotmama.org/board-of-directors/',
        // // url: 'https://www.apple.com/leadership/',
        // showInIframe: true
        text: '',
        url: '',
        showInIframe: false
    };
    @Input() obj: DsProjectRoomBlock[] = [
        // {
        //     blockName: '',
        //     numColumns: 2,
        //     fields: [
        //         {label: 'not_a_signature', inputType: 'checkbox'},
        //         {label: 'non_english_text', inputType: 'checkbox'},
        //         {label: 'other', inputType: 'checkbox', value: 0},
        //         {label: 'reason', inputType: 'text', depend: 'other', dependOnValue: 1}
        //     ],
        // },
        // {
        //     blockName: 'name',
        //     numColumns: 2,
        //     fields: [
        //         {label: 'first_name', inputType: 'text', breakLine: true, center: true},
        //         {label: 'last_name', inputType: 'text', fullLine: true},
        //         {label: 'prefix', inputType: 'text', center: true},
        //     ],
        // },
        // {
        //     blockName: 'connections',
        //     numColumns: 2,
        //     fields: [
        //         {label: 'phones', inputType: 'text_list'},
        //         {label: 'faxes', inputType: 'text_list'},
        //         {label: 'comments', inputType: 'textarea'},
        //         {label: 'other', inputType: 'checkbox', value: 0},
        //         {label: 'type', inputType: 'select', options: ['one', 'two', 'three'], depend: 'other'}
        //     ],
        // }
    ];
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    constructor(
        @Inject(DOCUMENT) document?: any
    ) {
        this.document = document;
    }


    listenToIframeLoad(): void {
        if (this.iframe) {
            this.iframeLoading = true;
            const iframe = this.iframe.nativeElement;
            iframe.onload = () => {
                this.iframeLoading = false;
            };
        }
    }

    initObj(): void {
        this.mainList = [];
        this.listCurrentIndex = 0;
        for (const i in this.obj) {
            for (const j in this.obj[i].fields) {
                if (this.obj[i].fields[j].inputType === 'checkbox') {
                    if (!this.obj[i].fields[j].value) {
                        this.obj[i].fields[j].value = 0;
                    }
                } else if (this.obj[i].fields[j].inputType === 'text') {
                    if (!this.obj[i].fields[j].value) {
                        this.obj[i].fields[j].value = '';
                    }
                } else if (this.obj[i].fields[j].inputType === 'text_list') {
                    if (!this.obj[i].fields[j].value) {
                        this.obj[i].fields[j].value = [];
                    }
                } else {
                    if (!this.obj[i].fields[j].value) {
                        this.obj[i].fields[j].value = '';
                    }
                }
            }
        }
        if (this.data.isList) {
            this.listObj = JSON.parse(JSON.stringify(this.obj));
            this.addToMainList();
        }
    }
    ngOnInit(): void {
        this.resetDrag();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.listenToIframeLoad();
        });
    }

    checkDepend(fields, item): boolean {
        if (!item.depend) {
            return false;
        }
        const map = fields.map((o) => o.label);
        const index = map.indexOf(item.depend);
        let condition = fields[index].value;
        if (item.dependOnValue) {
            condition = fields[index].value === item.dependOnValue;
        }
        if (index > -1 && condition) {
            return false;
        } else {
            if (item.value) {
                setTimeout(() => {
                    item.value = '';
                });
            }
            return true;
        }
    }

    addToMainList(): void {
        const obj = JSON.parse(JSON.stringify(this.listObj));
        this.mainList.push(obj);
        this.listCurrentIndex = this.mainList.length - 1;
        this.obj = this.mainList[this.listCurrentIndex];
        // console.log('this.mainList', this.mainList);
    }
    removeFromMainList(index): void {
        this.mainList.splice(index, 1);
        // console.log('this.listCurrentIndex', this.listCurrentIndex)
        // console.log('index', index)
        if (this.listCurrentIndex > 0) {
            this.listCurrentIndex--;
        } else {
            this.listCurrentIndex = 0;
        }
        this.obj = this.mainList[this.listCurrentIndex];
    }
    selectMainItem(index): void {
        this.listCurrentIndex = index;
        console.log('this.mainList[this.listCurrentIndex]', this.mainList[this.listCurrentIndex])
        this.obj = this.mainList[this.listCurrentIndex];
    }
    getMainObjHeader(index): string {
        let header =  this.data.listItemDefaultHeader + ' ' + (index + 1);
        try {
            const firstLabelValue = this.mainList[index][this.data.listObjIndex].fields[this.data.listFirstItemIndex].value || '';
            const secondLabelValue = this.mainList[index][this.data.listObjIndex].fields[this.data.listSecondItemIndex].value || '';
            if (firstLabelValue || secondLabelValue) {
                header = firstLabelValue + (firstLabelValue ? ' ' : '') + secondLabelValue;
            }
        } catch (err) {
            console.log(err)
        }
        return header;
    }
    appendItemToList(item): void {
        let val = '';
        if (item.listObj) {
            val = this.cloneObject(item.listObj);
        }
        item.value.push(val);
    }
    removeItemToList(item, index): void {
        item.value.splice(index, 1);
    }
    cloneObject(obj): any {
        return JSON.parse(JSON.stringify(obj));
    }
    isArray(arr): boolean {
        return Array.isArray(arr);
    }
    trackByFn(index: any, item: any): number {
        return index;
    }
    originalObjectOrder(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
        return 0;
    }
    preetyLabel(label): string {
        const str =  label.replace(/_/g, ' ').replace(/-/g, ' ');
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    onMouseDown(e: any, name: string, type: string): void {
        const pos = this.getPointerPos(e, false);
        this.currentDrag[name].mousedown = true;
        this.currentDrag[name].startPos = pos;
        this.currentDrag[name].type = type;
        this.dragStarted = true;
        this.document.body.classList.add('disable-mobile-refresh');
    }

    @HostListener('document:mouseup', ['$event'])
    @HostListener('document:touchend', ['$event'])
    onMouseUp(e): void {
        if (this.currentDrag.view.mousedown) {
            this.currentDrag.view.mousedown = false;
            this.currentDrag.view.startPos = null;
        }
        if (this.currentDrag.labeling.mousedown) {
            this.currentDrag.labeling.mousedown = false;
            this.currentDrag.labeling.startPos = null;
        }
        this.dragStarted = false;
        this.document.body.classList.remove('disable-mobile-refresh');
    }

    @HostListener('document:mousemove', ['$event'])
    @HostListener('document:touchmove', ['$event'])
    onMouseMove(e): void {
        if (this.dragStarted) {
            let type = '';
            if (this.currentDrag.view.mousedown) {
                type = 'view';
            }
            if (this.currentDrag.labeling.mousedown) {
                type = 'labeling';
            }
            if (!type) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            const pos = this.getPointerPos(e, false);
            const moveX = pos.x - this.currentDrag[type].startPos.x;
            const moveY = pos.y - this.currentDrag[type].startPos.y;
            const moveXPercent = moveX / this.dsProjectRoom.nativeElement.clientWidth * 100;
            const moveYPercent = moveY / this.dsProjectRoom.nativeElement.clientHeight * 100;
            // if (this.currentDrag[type].onMove.currentPos === 'top') {
            //     moveYPercent = -moveYPercent;
            // }
            if (this.currentDrag.version === 1) {
                this.onMoveVersion1(type, moveXPercent, moveYPercent);
            } else if (this.currentDrag.version === 2) {
                this.onMoveVersion1(type, moveXPercent, moveYPercent);
            } else if (this.currentDrag.version === 3) {
                // this.onMoveVersion3(type, moveXPercent, moveYPercent);
            }
            this.onMoveLimitTopBottom();
            this.onMoveLimitLeft();
            this.onMoveLimitRight();

            // if (this.currentDrag.labeling.height < 0) {
            //     this.currentDrag.datasets.height = 0;
            //     this.currentDrag.serviceResults.top = this.currentDrag.minTop;
            //     this.currentDrag.view.top = this.currentDrag.minTop;
            // }
            // if (this.currentDrag.datasets.height > this.currentDrag.maxTop) {
            //     this.currentDrag.datasets.height = this.currentDrag.maxTop;
            //     this.currentDrag.serviceResults.top = 100;
            //     this.currentDrag.view.top = 100;
            // }
            // if (this.currentDrag.serviceResults.left < this.currentDrag.minLeft - this.currentDrag.serviceResults.marginLeft) {
            //     this.currentDrag.serviceResults.left = this.currentDrag.minLeft - this.currentDrag.serviceResults.marginLeft;
            //     this.currentDrag.view.right = this.currentDrag.maxLeft + this.currentDrag.serviceResults.marginLeft;
            // }
            // if (this.currentDrag.serviceResults.left > this.currentDrag.maxLeft + this.currentDrag.serviceResults.marginLeft) {
            //     this.currentDrag.serviceResults.left = this.currentDrag.maxLeft + this.currentDrag.serviceResults.marginLeft;
            //     this.currentDrag.view.right = this.currentDrag.minLeft - this.currentDrag.view.marginRight;
            // }
            this.currentDrag[type].startPos = pos;
        }
    }

    /**
     * Get the pointer position
     * param {any} e (event)
     * param {any} preventTouch
     * return {Object} { x: , y: }
     */
    getPointerPos(e: any, preventTouch): any {
        let x = 0;
        let y = 0;
        if (e.clientX !== undefined && e.clientY !== undefined) {
            x = e.clientX;
            y = e.clientY;
        } else if (e.taretTouches) {
            if (preventTouch) {
                e.preventDefault();
            }
            x = e.taretTouches[0].clientX;
            y = e.taretTouches[0].clientY;
        } else if (e.touches) {
            if (preventTouch) {
                e.preventDefault();
            }
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        return {
            x: x,
            y: y
        };
    }

    onMoveLimitTopBottom(): void {
        if (this.currentDrag.labeling.onMove.top) {
            // console.log(this.currentDrag.labeling[this.currentDrag.labeling.onMove.top]);
            if (this.currentDrag.labeling[this.currentDrag.labeling.onMove.top] < 0) {
                this.currentDrag.labeling[this.currentDrag.labeling.onMove.top] = 0;
            }
            if (this.currentDrag.labeling[this.currentDrag.labeling.onMove.top] > this.currentDrag.maxTop) {
                this.currentDrag.labeling[this.currentDrag.labeling.onMove.top] = this.currentDrag.maxTop;
            }
        }
        if (this.currentDrag.labeling.onMove.bottom) {
            if (this.currentDrag.labeling[this.currentDrag.labeling.onMove.bottom] < 0) {
                this.currentDrag.labeling[this.currentDrag.labeling.onMove.bottom] = 0;
            }
            if (this.currentDrag.labeling[this.currentDrag.labeling.onMove.bottom] > this.currentDrag.maxTop) {
                this.currentDrag.labeling[this.currentDrag.labeling.onMove.bottom] = this.currentDrag.maxTop;
            }
        }
        if (this.currentDrag.view.onMove.top) {
            if (this.currentDrag.view[this.currentDrag.view.onMove.top] < 0) {
                this.currentDrag.view[this.currentDrag.view.onMove.top] = 0;
            }
            if (this.currentDrag.view[this.currentDrag.view.onMove.top] > this.currentDrag.maxTop) {
                this.currentDrag.view[this.currentDrag.view.onMove.top] = this.currentDrag.maxTop;
            }
        }
        if (this.currentDrag.view.onMove.bottom) {
            // console.log(this.currentDrag.view[this.currentDrag.view.onMove.bottom]);
            if (this.currentDrag.view[this.currentDrag.view.onMove.bottom] < 0) {
                this.currentDrag.view[this.currentDrag.view.onMove.bottom] = 0;
            }
            if (this.currentDrag.view[this.currentDrag.view.onMove.bottom] > this.currentDrag.maxTop) {
                this.currentDrag.view[this.currentDrag.view.onMove.bottom] = this.currentDrag.maxTop;
            }
        }
    }
    onMoveLimitLeft(): void {
        if (this.currentDrag.labeling.onMove.left) {
            if (this.currentDrag.labeling[this.currentDrag.labeling.onMove.left] < this.currentDrag.minLeft - this.currentDrag.labeling.marginLeft) {
                this.currentDrag.labeling[this.currentDrag.labeling.onMove.left] = this.currentDrag.minLeft - this.currentDrag.labeling.marginLeft;
            }
            if (this.currentDrag.labeling[this.currentDrag.labeling.onMove.left] > this.currentDrag.maxLeft + this.currentDrag.labeling.marginLeft) {
                this.currentDrag.labeling[this.currentDrag.labeling.onMove.left] = this.currentDrag.maxLeft + this.currentDrag.labeling.marginLeft;
            }
        }
        if (this.currentDrag.view.onMove.left) {
            if (this.currentDrag.view[this.currentDrag.view.onMove.left] < this.currentDrag.minLeft - this.currentDrag.view.marginLeft) {
                this.currentDrag.view[this.currentDrag.view.onMove.left] = this.currentDrag.minLeft - this.currentDrag.view.marginLeft;
            }
            if (this.currentDrag.view[this.currentDrag.view.onMove.left] > this.currentDrag.maxLeft + this.currentDrag.view.marginLeft) {
                this.currentDrag.view[this.currentDrag.view.onMove.left] = this.currentDrag.maxLeft + this.currentDrag.view.marginLeft;
            }
        }
    }
    onMoveLimitRight(): void {
        if (this.currentDrag.labeling.onMove.right) {
            if (this.currentDrag.labeling[this.currentDrag.labeling.onMove.right] > this.currentDrag.maxLeft + this.currentDrag.labeling.marginRight) {
                this.currentDrag.labeling[this.currentDrag.labeling.onMove.right] = this.currentDrag.maxLeft + this.currentDrag.labeling.marginRight;
            }
            if (this.currentDrag.labeling[this.currentDrag.labeling.onMove.right] < this.currentDrag.minLeft - this.currentDrag.labeling.marginRight) {
                this.currentDrag.labeling[this.currentDrag.labeling.onMove.right] = this.currentDrag.minLeft - this.currentDrag.labeling.marginRight;
            }
        }
        if (this.currentDrag.view.onMove.right) {
            if (this.currentDrag.view[this.currentDrag.view.onMove.right] > this.currentDrag.maxLeft + this.currentDrag.view.marginRight) {
                this.currentDrag.view[this.currentDrag.view.onMove.right] = this.currentDrag.maxLeft + this.currentDrag.view.marginRight;
            }
            if (this.currentDrag.view[this.currentDrag.view.onMove.right] < this.currentDrag.minLeft - this.currentDrag.view.marginRight) {
                this.currentDrag.view[this.currentDrag.view.onMove.right] = this.currentDrag.minLeft - this.currentDrag.view.marginRight;
            }
        }
    }

    onMoveVersion1(type, moveXPercent, moveYPercent): void {
        if (this.currentDrag[type].type.indexOf('bottom') > -1) {
            if (this.currentDrag.labeling.onMove.top) {
                this.currentDrag.labeling[this.currentDrag.labeling.onMove.top] += moveYPercent;
            }
            if (this.currentDrag.labeling.onMove.bottom) {
                this.currentDrag.labeling[this.currentDrag.labeling.onMove.bottom] -= moveYPercent;
            }
            if (this.currentDrag.view.onMove.top) {
                this.currentDrag.view[this.currentDrag.view.onMove.top] += moveYPercent;
            }
            if (this.currentDrag.view.onMove.bottom) {
                this.currentDrag.view[this.currentDrag.view.onMove.bottom] -= moveYPercent;
            }
        }
        if (this.currentDrag[type].type.indexOf('left') > -1) {
            // console.log(this.currentDrag.labeling[this.currentDrag.labeling.onMove.left])
            // this.currentDrag.serviceResults.left += moveXPercent;
            // this.currentDrag.view.right -= moveXPercent;
            if (this.currentDrag.labeling.onMove.left) {
                this.currentDrag.labeling[this.currentDrag.labeling.onMove.left] += moveXPercent;
            }
            if (this.currentDrag.labeling.onMove.right) {
                this.currentDrag.labeling[this.currentDrag.labeling.onMove.right] -= moveXPercent;
            }
            if (this.currentDrag.view.onMove.left) {
                this.currentDrag.view[this.currentDrag.view.onMove.left] += moveXPercent;
            }
            if (this.currentDrag.view.onMove.right) {
                this.currentDrag.view[this.currentDrag.view.onMove.right] -= moveXPercent;
            }
        }
        else if (this.currentDrag[type].type.indexOf('right') > -1) {
            // this.currentDrag.serviceResults.left += moveXPercent;
            // this.currentDrag.view.right -= moveXPercent;
            if (this.currentDrag.labeling.onMove.left) {
                this.currentDrag.labeling[this.currentDrag.labeling.onMove.left] += moveXPercent;
            }
            if (this.currentDrag.labeling.onMove.right) {
                this.currentDrag.labeling[this.currentDrag.labeling.onMove.right] -= moveXPercent;
            }
            if (this.currentDrag.view.onMove.left) {
                this.currentDrag.view[this.currentDrag.view.onMove.left] += moveXPercent;
            }
            if (this.currentDrag.view.onMove.right) {
                this.currentDrag.view[this.currentDrag.view.onMove.right] -= moveXPercent;
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.obj) {
            this.initObj();
            this.onChangeObj();
        }
        if (changes.data && !changes.data.firstChange) {
            setTimeout(() => {
                this.listenToIframeLoad();
            });
        }
        if (changes.templateType && !changes.templateType.firstChange) {
            this.resetView();
            this.animateChangingTemplate();
        }
    }

    resetDrag(): void {
        if (this.templateType === 1) {
            this.currentDrag = JSON.parse(JSON.stringify(this.verticalDrag));
        } else {
            this.currentDrag = JSON.parse(JSON.stringify(this.horizontalDrag));
        }
    }

    resetView(): void {
        this.resetViewAnimate = true;
        this.resetDrag();
        setTimeout(() => {
            this.resetViewAnimate = false;
        }, 300);
    }

    changeTemplateType(): void {
        if (this.templateType === 1) {
            this.templateType = 2;
        } else {
            this.templateType = 1;
        }
        this.resetView();
        this.animateChangingTemplate();
    }

    animateChangingTemplate(): void {
        clearTimeout(this.changeTemplateAnimationTimeout);
        this.changeTemplateAnimation = true;
        this.changeTemplateAnimationTimeout = setTimeout(() => {
            this.changeTemplateAnimation = false;
        }, 1200);
    }

    onChangeObj(): void {
        if (this.data.isList) {
            const map = this.mainList.map((o) => this.getFinalObject(o));
            this.onChange.emit(map);
        } else {
            this.onChange.emit(this.getFinalObject(this.obj));
        }
    }

    getFinalObject(currrentObj): any[] {
        const blocks = [];
        for (const block of currrentObj) {
            const obj = {
                blockName: block.blockName, fields: []
            };
            for (const field of block.fields) {
                const val = field.value === undefined ?
                    (field.inputType === 'checkbox' ? 0 :
                            (field.inputType === 'text_list' ? [] : '')
                    ) : field.value;
                obj.fields.push({
                    label: field.label, value: field.value
                });
            }
            blocks.push(obj);
        }
        return blocks;
    }

    getObjKeysLength(listObj): number {
        return Object.keys(listObj).length;
    }
}

export class DsProjectRoomBlock {
    blockName = '';
    blockDesc = '';
    numColumns: 2;
    fields: DsProjectRoomBlockField[] = [];

    constructor(obj?) {
        if (obj) {
            if (obj.blockName) {
                this.blockName = obj.blockName;
            }
            if (obj.blockDesc) {
                this.blockDesc = obj.blockDesc;
            }
            if (obj.numColumns) {
                this.numColumns = obj.numColumns;
            }
            if (obj.fields) {
                for (const i in obj.fields) {
                    this.fields.push( new DsProjectRoomBlockField(obj.fields[i]));
                }
            }
        }
    }
}

export class DsProjectRoomBlockField {
    label = '';
    description = '';
    value: any = '';
    inputType = '';
    listObj?: any;
    depend: string;
    dependOnValue: any;
    breakLine: boolean;
    fullLine: boolean;
    center: boolean;
    selectOptions: any[];
    css: any;

    constructor(obj?) {
        if (obj) {
            for (const key in obj) {
                if (obj[key] !== undefined && obj[key] !== null) {
                    this[key] = obj[key];
                }
            }
        }
    }
}

export class DsProjectRoomData {
    text = '';
    url = '';
    showInIframe = false;
    isList?: boolean;
    listHeader?: string;
    listItemDefaultHeader?: string;
    listObjIndex?: number;
    listFirstItemIndex?: number;
    listSecondItemIndex?: number;

    constructor(obj?) {
        if (obj) {
            for (const key in obj) {
                if (obj[key] !== undefined && obj[key] !== null) {
                    this[key] = obj[key];
                }
            }
        }
    }
}
