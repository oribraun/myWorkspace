import {
    AfterViewInit, ChangeDetectorRef,
    Component, DoCheck, ElementRef, EventEmitter,
    HostListener,
    Inject, Input,
    OnChanges,
    OnInit, Output,
    SimpleChanges,
    ViewChild, ViewEncapsulation
} from '@angular/core';
import {DOCUMENT, KeyValue} from '@angular/common';
import {NgForm} from '@angular/forms';
import {last} from "rxjs/operators";

@Component({
    selector: 'lib-dynamic-labeling-room',
    templateUrl: './dynamic-labeling-room.component.html',
    styleUrls: ['./dynamic-labeling-room.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class DynamicLabelingRoomComponent implements OnInit, AfterViewInit, OnChanges {

    @ViewChild('dynamic_labeling_room') dynamicLabelingRoom: any;
    @ViewChild('iframe') iframe: any;
    @ViewChild('labelingHeader') labelingHeader: any;
    @ViewChild('labelingBody') labelingBody: any;
    @ViewChild('viewText') viewText: any;
    @ViewChild('urlText') urlText: any;
    @ViewChild('form') form: NgForm;
    private document: Document;
    public formSubmitted = false;
    public dragStarted = false;
    public resetViewAnimate = false;
    public resetViewAnimateTimeout;
    public animateMenu = false;
    public menuOnRight = true;
    public animateMenuTimeout;
    public changeTemplateAnimation = false;
    public changeTemplateAnimationTimeout;
    public autoDragBasedOnViewSizeTimeout;
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
    public expandDetails: any = {
        inProgress: false,
        expended: false,
        parent: {},
        original: {},
        css: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        }
    };
    public iframeLoading = false;
    public mainList = [];
    public listCurrentIndex = 0;
    public listBlocks: any;
    public templateTypes = {horizontal: 1, vertical: 2};
    public currentWindowWidth: number;
    @Input() mainCssObj;
    @Input() viewCssObj;
    @Input() formCssObj;
    @Input() templateType = this.templateTypes.horizontal;
    @Input() initDragBasedOnViewTextSize = false;
    @Input() enableHistory = false;
    private historyLimit = 100;
    private historyEnableCtrlY = false;
    @Input() data: DsProjectRoomData = {
        // text: 'signature',
        // url: 'https://polkadotmama.org/board-of-directors/',
        // // url: 'https://www.apple.com/leadership/',
        // showInIframe: true
        text: '',
        url: '',
        showInIframe: false
    };
    @Input() blocks: DsProjectRoomBlock[] = [
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
    @Output() onChange: EventEmitter<OutputObj> = new EventEmitter<OutputObj>();
    public mainBlocks: DsProjectRoomBlock[] = [];
    public blocksErrMessage = '';
    public history = [];
    public historyIndex = 0;
    public viewScrollSize = 0;
    constructor(
        private ref: ChangeDetectorRef,
        @Inject(DOCUMENT) document?: any
    ) {
        this.document = document;
        this.getWindowWidth();
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

    setUpMainBlocks() {
        this.mainBlocks = this.cloneObject(this.blocks);
    }

    initObj(doNotAutoDrag = false): void {
        this.resetBlocksError();
        this.mainList = [];
        this.listCurrentIndex = 0;
        const mainObj: any = this.handleInitObjIsList();
        if (!this.mainBlocks || !this.mainBlocks.length) {
            this.setBlocksError('blocks have no items - please make sure blocks has at least one DsProjectRoomBlock item');
            return;
        }
        if (this.mainBlocks.length && !this.mainBlocks[0].fields) {
            this.setBlocksError('blocks have no structure - please make sure blocks has at least one DsProjectRoomBlock item');
            return;
        }
        for (const i in this.mainBlocks) {
            for (const j in this.mainBlocks[i].fields) {
                if (this.mainBlocks[i].fields[j].inputType === 'checkbox') {
                    if (!this.mainBlocks[i].fields[j].value) {
                        this.mainBlocks[i].fields[j].value = 0;
                    }
                } else if (this.mainBlocks[i].fields[j].inputType === 'text') {
                    if (!this.mainBlocks[i].fields[j].value) {
                        this.mainBlocks[i].fields[j].value = '';
                    }
                } else if (this.mainBlocks[i].fields[j].inputType === 'text_list') {
                    if (!this.mainBlocks[i].fields[j].value) {
                        this.mainBlocks[i].fields[j].value = [];
                    }
                } else {
                    if (!this.mainBlocks[i].fields[j].value) {
                        this.mainBlocks[i].fields[j].value = '';
                    }
                }
            }
        }
        if (this.data && this.data.isList) {
            this.setUpListObj();
            this.addToMainList(this.listBlocks);
            this.cleanListBlocks();
            this.addToListInitObj(mainObj);
        }
        if (this.initDragBasedOnViewTextSize && !doNotAutoDrag) {
            this.autoDragBasedOnViewSize();
        }
        if (this.enableHistory) {
            this.resetHistory();
        }
        this.detectViewScrollSize();
    }

    setListFixedHeader() {
        const item = this.labelingHeader.nativeElement;
        const style = getComputedStyle(item);
        const headerHeight = this.labelingHeader.nativeElement.clientHeight;
        const h = headerHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        this.labelingBody.nativeElement.style.marginTop = h + 'px';
    }

    unsetListFixedHeader() {
        this.labelingBody.nativeElement.style.marginTop = '';
    }

    handleInitObjIsList() {
        let returnObj = [];
        const mainObj: any = this.mainBlocks;
        if (mainObj && Array.isArray(mainObj[0]) && mainObj[0][0] && mainObj[0][0].fields && mainObj[0][0].fields.length) {
            this.mainBlocks = mainObj[0];
            mainObj.shift();
            returnObj = mainObj;
        }
        return returnObj;
    }

    addToListInitObj(mainObj: DsProjectRoomBlock[]) {
        if (mainObj && mainObj.length) {
            for (const o of mainObj) {
                this.addToMainList(o);
            }
            this.listCurrentIndex = 0;
            this.mainBlocks = this.mainList[this.listCurrentIndex];
        }
    }

    setUpListObj() {
        this.listBlocks =  this.cloneObject(this.mainBlocks);
    }
    cleanListBlocks() {
        for (const i in this.listBlocks) {
            for (const j in this.listBlocks[i].fields) {
                if (this.listBlocks[i].fields[j].inputType === 'checkbox') {
                    this.listBlocks[i].fields[j].value = 0;
                } else if (this.listBlocks[i].fields[j].inputType === 'text') {
                    this.listBlocks[i].fields[j].value = '';
                } else if (this.listBlocks[i].fields[j].inputType === 'text_list') {
                    this.listBlocks[i].fields[j].value = [];
                } else {
                    this.listBlocks[i].fields[j].value = '';
                }
            }
        }
    }
    ngOnInit(): void {
        this.setDragDirection();
        setTimeout(() => {
            this.firstAnimateMenu();
        });
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
        if (!fields[index]) {
            return false;
        }
        let condition = fields[index].value;
        if (item.dependOnValue) {
            condition = fields[index].value === item.dependOnValue;
        }
        if (index > -1 && condition) {
            return false;
        } else {
            return true;
        }
    }

    addToMainList(listBlocks, history = false): void {
        const blocks = this.cloneObject(listBlocks);
        this.mainList.push(blocks);
        this.listCurrentIndex = this.mainList.length - 1;
        this.mainBlocks = this.mainList[this.listCurrentIndex];
        this.resetFormSubmitted();
        if (this.data.listHeaderFixed) {
            setTimeout(() => {
                this.setListFixedHeader();
            });
        }
        if (history) {
            this.addToHistory('addToMainList', this.listCurrentIndex, 'removeFromMainList', {listBlocks: this.mainList[this.listCurrentIndex], index: this.listCurrentIndex}, 'addToMainListForHistoryOnly');
        }
        // console.log('this.mainList', this.mainList);
    }

    addToMainListForHistoryOnly(obj): void {
        const blocks = this.cloneObject(obj.listBlocks);
        this.mainList.splice(obj.index, 0, blocks);
        this.listCurrentIndex = obj.index;
        this.mainBlocks = this.mainList[this.listCurrentIndex];
        this.resetFormSubmitted();
        if (this.data.listHeaderFixed) {
            setTimeout(() => {
                this.setListFixedHeader();
            });
        }
    }

    addToMainListIfFormIsValid(): void {
        if (this.form && !(this.formSubmitted && this.form.invalid)) {
            this.resetFormSubmitted();
            this.addToMainList(this.listBlocks);
        } else {
            alert('please fill all required data before adding ' + this.data.listHeader);
        }
    }
    removeFromMainList(index, history = false): void {
        if (history) {
            this.addToHistory('removeFromMainList', {listBlocks: this.mainList[index], index}, 'addToMainListForHistoryOnly', index, 'removeFromMainList');
        }
        this.mainList.splice(index, 1);
        // console.log('this.listCurrentIndex', this.listCurrentIndex)
        // console.log('index', index)
        if (this.listCurrentIndex > 0) {
            this.listCurrentIndex--;
        } else {
            this.listCurrentIndex = 0;
        }
        this.mainBlocks = this.mainList[this.listCurrentIndex];
        if (this.data.listHeaderFixed) {
            setTimeout(() => {
                this.setListFixedHeader();
            });
        }
    }
    selectMainItem(index): void {
        this.listCurrentIndex = index;
        this.mainBlocks = this.mainList[this.listCurrentIndex];
    }
    getMainObjHeader(index): string {
        let header =  (this.data.listItemDefaultHeader ? this.data.listItemDefaultHeader + ' ' : 'Item ') + (index + 1);
        try {
            let firstLabelValue = '';
            let secondLabelValue = '';
            if (this.data.listBlockFieldFirstIndex >= 0
                && this.mainList[index]
                && this.mainList[index][this.data.listBlockIndex]
                && this.mainList[index][this.data.listBlockIndex].fields
                && this.mainList[index][this.data.listBlockIndex].fields[this.data.listBlockFieldFirstIndex]) {
                firstLabelValue = this.mainList[index][this.data.listBlockIndex].fields[this.data.listBlockFieldFirstIndex].value;
            }
            if (this.data.listBlockFieldSecondIndex >= 0
                && this.mainList[index]
                && this.mainList[index][this.data.listBlockIndex]
                && this.mainList[index][this.data.listBlockIndex].fields
                && this.mainList[index][this.data.listBlockIndex].fields[this.data.listBlockFieldSecondIndex]) {
                secondLabelValue = this.mainList[index][this.data.listBlockIndex].fields[this.data.listBlockFieldSecondIndex].value;
            }
            if (firstLabelValue || secondLabelValue) {
                if (secondLabelValue) {
                    firstLabelValue += ' ';
                }
                header = firstLabelValue + secondLabelValue;
            }
        } catch (err) {
            console.log(err);
        }
        return header;
    }
    appendItemToList(item): void {
        let val = '';
        if (item.listBlocks) {
            val = this.cloneObject(item.listBlocks);
        }
        item.value.push(val);
        this.addToHistory('appendItemToList', {item, index: item.value.length - 1}, 'removeItemToListAsObjectForHistoryObly');
    }
    appendItemToListForHistoryOnly(obj): void {
        const item = obj.item;
        const val = obj.val;
        const index = obj.index;
        item.value.splice(index, 0, val);
    }
    // not in use
    removeItemToList(item, index): void {
        item.value.splice(index, 1);
    }
    removeItemToListAsObject(obj): void {
        this.addToHistory('removeItemToListAsObject', {item: obj.item, val: obj.item.value[obj.index], index: obj.index}, 'appendItemToListForHistoryOnly');
        obj.item.value.splice(obj.index, 1);
    }
    removeItemToListAsObjectForHistoryObly(obj): void {
        obj.item.value.splice(obj.index, 1);
    }
    cloneObject(obj: any): any { // will ignore functions
        return JSON.parse(JSON.stringify(obj));
    }
    deepCloneObject(obj) { // recursive will include functions
        if (obj === null) { return null; }
        const clone = Object.assign({}, obj);
        Object.keys(clone).forEach(
            key =>
                (clone[key] =
                    typeof obj[key] === 'object' ? this.deepCloneObject(obj[key]) : obj[key])
        );
        if (Array.isArray(obj)) {
            clone.length = obj.length;
            return Array.from(clone);
        }
        return clone;
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
        if (!label) {
            return;
        }
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
            const moveXPercent = moveX / this.dynamicLabelingRoom.nativeElement.clientWidth * 100;
            const moveYPercent = moveY / this.dynamicLabelingRoom.nativeElement.clientHeight * 100;
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
    validateBlocks() {
        this.mainBlocks.forEach((o, i) => {
            if (Array.isArray(o)){
                o.forEach((o2, i2) => this.mainBlocks[i][i2] = new DsProjectRoomBlock(o2));
            } else {
                this.mainBlocks[i] = new DsProjectRoomBlock(o);
            }
        });
    }

    resetFormSubmitted() {
        this.formSubmitted = false;
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.blocks) {
            this.setUpMainBlocks();
            this.validateBlocks();
            this.initObj();
            if (!changes.blocks.firstChange) {
                this.onChangeBlocks();
                this.resetFormSubmitted();
            }
        }
        if (changes.data && !changes.data.firstChange) {
            const textOrUrlChanged = (changes.data.previousValue.text !==  changes.data.currentValue.text || changes.data.previousValue.url !==  changes.data.currentValue.url);
            setTimeout(() => {
                this.listenToIframeLoad();
            });
            if (this.data.listHeaderFixed) {
                setTimeout(() => {
                    this.setListFixedHeader();
                });
            } else {
                this.unsetListFixedHeader();
            }
            if (this.initDragBasedOnViewTextSize && textOrUrlChanged) {
                if (!changes.templateType) {
                    this.resetView();
                    clearTimeout(this.autoDragBasedOnViewSizeTimeout);
                    if (this.initDragBasedOnViewTextSize) {
                        this.autoDragBasedOnViewSizeTimeout = setTimeout(() => {
                            this.autoDragBasedOnViewSize(true);
                        }, 300);
                    }
                    this.detectViewScrollSize();
                }
            }
            if (changes.data.previousValue.isList !==  changes.data.currentValue.isList) {
                let doNotAutoDrag = false;
                if (textOrUrlChanged || changes.templateType) {
                    doNotAutoDrag = true;
                }
                setTimeout(() => {
                    this.initObj(doNotAutoDrag);
                });
            }
        }
        if (changes.templateType && !changes.templateType.firstChange) {
            this.resetView();
            this.animateChangingTemplate();
            if (this.initDragBasedOnViewTextSize) {
                clearTimeout(this.autoDragBasedOnViewSizeTimeout);
                this.autoDragBasedOnViewSizeTimeout = setTimeout(() => {
                    this.autoDragBasedOnViewSize(true);
                }, 300);
            }
            this.detectViewScrollSize();
        }
    }

    setDragDirection(): void {
        if (this.templateType ===  this.templateTypes.horizontal) {
            this.currentDrag = this.cloneObject(this.verticalDrag);
        } else {
            this.currentDrag = this.cloneObject(this.horizontalDrag);
        }
    }

    detectViewScrollSize() {
        setTimeout(() => {
            let el;
            if (this.viewText) {
                el = this.viewText.nativeElement;
            }
            if (this.urlText) {
                el = this.urlText.nativeElement;
            }
            if (this.iframe) {
                el = this.iframe.nativeElement;
            }
            if (el) {
                try {
                    if (!this.iframe) {
                        const parent = el.parentNode;
                        const style = getComputedStyle(parent);
                        const parentWidth = parent.offsetWidth;
                        const scrollerWidth = parentWidth - parent.clientWidth;
                        if (scrollerWidth) {
                            this.viewScrollSize = scrollerWidth;
                        }
                    } else {
                        if (el.contentWindow.document.documentElement.scrollHeight > 0) {
                            const body = el.contentWindow.document.documentElement.getElementsByTagName('body');
                            if (body.length) {
                                const scrollerWidth = el.offsetWidth - body[0].offsetWidth;
                                if (scrollerWidth) {
                                    this.viewScrollSize = scrollerWidth;
                                }
                            }
                        }
                    }
                } catch (e) {}
            }
        });
    }

    autoDragBasedOnViewSize(animate = false) {
        setTimeout(() => {
            let el;
            if (this.viewText) {
                el = this.viewText.nativeElement;
            }
            if (this.urlText) {
                el = this.urlText.nativeElement;
            }
            if (el) {
                const parent = el.parentNode;
                if (el) {
                    if (this.templateType === this.templateTypes.horizontal) {
                        const height = el.offsetHeight;
                        const style = getComputedStyle(parent);
                        const parentHeight = parent.offsetHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
                        const extraSpace = 5; // 5 pixels
                        const moveY = parentHeight - height - extraSpace;
                        // if (moveY > 0) {
                        const moveYPercent = -moveY / this.dynamicLabelingRoom.nativeElement.clientHeight * 100;
                        if (moveYPercent > 0) {
                            return;
                        }
                        const type = 'view';
                        if (animate) {
                            this.resetView(false);
                        }
                        this.currentDrag[type].type = 'top,bottom';
                        this.onMoveVersion1(type, 0, moveYPercent);
                        // }
                    } else {
                        const width = el.offsetWidth;
                        const style = getComputedStyle(parent);
                        const parentWidth = parent.offsetWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
                        const moveX = parentWidth - width;
                        // if (moveX > 0) {
                        const moveXPercent = moveX / this.dynamicLabelingRoom.nativeElement.clientWidth * 100;
                        if (moveXPercent < 0) {
                            return;
                        }
                        const type = 'view';
                        if (animate) {
                            this.resetView(false);
                        }
                        this.currentDrag[type].type = 'left,right';
                        this.onMoveVersion1(type, moveXPercent, 0);
                        // }
                        // console.log('moveX', moveX)
                    }
                }
            }
        });
    }

    resetView(setDragDirection = true): void {
        this.resetViewAnimate = true;
        this.changeDetectorRefresh();
        if (setDragDirection) {
            this.setDragDirection();
        }
        clearTimeout(this.resetViewAnimateTimeout);
        this.resetViewAnimateTimeout = setTimeout(() => {
            this.resetViewAnimate = false;
            this.changeDetectorRefresh();
        }, 300);
    }

    changeTemplateType(): void {
        if (this.templateType === this.templateTypes.horizontal) {
            this.templateType = this.templateTypes.vertical;
        } else {
            this.templateType = this.templateTypes.horizontal;
        }
        this.resetView();
        this.animateChangingTemplate();
    }

    animateChangingTemplate(): void {
        clearTimeout(this.changeTemplateAnimationTimeout);
        this.changeTemplateAnimation = true;
        this.changeDetectorRefresh();
        this.changeTemplateAnimationTimeout = setTimeout(() => {
            this.changeTemplateAnimation = false;
            this.changeDetectorRefresh();
        }, 1000);
    }

    getOutputObject() {
        let obj: OutputObj;
        if (this.data && this.data.isList) {
            if (this.mainList[this.listCurrentIndex]) {
                this.mainList[this.listCurrentIndex].isValid = !this.form.invalid;
            }
            // this.checkValidBlock(this.mainList[this.listCurrentIndex]);
            const isValid = this.checkValidList(this.listCurrentIndex);
            const map = this.mainList.map((o) => this.getFinalObject(o));
            obj = {
                blocks: this.mainList,
                valid: isValid,
                cleanBlocks: map,
            };
        } else {
            obj = {
                blocks: this.mainBlocks,
                valid: !this.form.invalid,
                cleanBlocks: this.getFinalObject(this.mainBlocks)
            };
        }
        return obj;
    }

    onChangeBlocks(): void {
        if (this.form) {
            this.formSubmitted = true;
            this.form.onSubmit(undefined);
            const obj = this.getOutputObject();
            this.onChange.emit(obj);
        }
    }

    getFinalObject(currentBlocks): any[] {
        const copyCurrentBlocks = this.cloneObject(currentBlocks);
        const cleanBlocks = [];
        for (const block of copyCurrentBlocks) {
            const obj = {
                blockName: block.blockName, fields: []
            };
            for (const field of block.fields) {
                const val = field.value === undefined ?
                    (field.inputType === 'checkbox' ? 0 :
                            (field.inputType === 'text_list' ? [] : '')
                    ) : field.value;
                if ((typeof field.value === 'number' && field.value > 0)
                    || (typeof field.value !== 'number' && field.value.toString().length)
                ) {
                    if (Array.isArray(field.value) && field.value.length) {
                        const map = field.value.map((o) => {
                            if (Array.isArray(o)) {
                                return o.map((o2) => {
                                    return {
                                        label: o2.label, value: o2.value
                                    };
                                });
                            } else {
                                return o;
                            }
                        });
                        field.value = map;
                    }
                    obj.fields.push({
                        label: field.label, value: field.value
                    });
                }
            }
            cleanBlocks.push(obj);
        }
        return cleanBlocks;
    }

    checkValidBlock(currentObj) {
        let valid = true;
        currentObj.isValid = valid;
        mainLoop:
        for (const block of currentObj) {
            for (const field of block.fields) {
                if (!field.value && field.required) {
                    valid = false;
                    currentObj.isValid = valid;
                    break mainLoop;
                }
                if (field.value && field.required && field.pattern) {
                    const pettern = new RegExp(field.pattern);
                    valid = pettern.test(field.value);
                    if (!valid) {
                        currentObj.isValid = valid;
                        break mainLoop;
                    }
                }
                if (field.inputType === 'text_list' && field.listBlocks) {
                    const labelsToCheck = {}
                    for (let i in field.listBlocks) {
                        if (field.listBlocks[i].required) {
                            labelsToCheck[field.listBlocks[i].label] = {required: true, i: i};
                            if (field.listBlocks[i].pattern) {
                                labelsToCheck[field.listBlocks[i].label] = {required: true, pattern: field.listBlocks[i].pattern, i: i};
                            }
                        }
                        // console.log('field.value', field.listBlocks[i])
                    }
                    if (Array.isArray(field.value)) {
                        for (let i in field.value) {
                            for (let j in field.value[i]) {
                                const currLabel = field.value[i][j].label;
                                const currValue = field.value[i][j].value;
                                if (labelsToCheck[currLabel] && labelsToCheck[currLabel].i === j) {
                                    if (labelsToCheck[currLabel].required && field.value[labelsToCheck[currLabel].i]) {
                                        if (!currValue) {
                                            valid = false;
                                            currentObj.isValid = valid;
                                            break mainLoop;
                                        }
                                        if (currValue && labelsToCheck[currLabel].pattern) {
                                            const pettern = new RegExp(labelsToCheck[currLabel].pattern);
                                            valid = pettern.test(currValue);
                                            if (!valid) {
                                                currentObj.isValid = valid;
                                                break mainLoop;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return valid;
    }
    checkValidList(currIndex): boolean {
        let valid = true;
        for (const currentObj of this.mainList) {
            valid = this.checkValidBlock(currentObj);
            // if (valid === false) {
            //     break;
            // }
        }
        // for (let i = currIndex; i >= 0; i--) {
        //     const currentObj = this.mainList[i];
        //     console.log('currentObj', currentObj)
        //     valid = this.checkValidBlock(currentObj);
        //     if (valid === false) {
        //         // break;
        //     }
        // }
        return valid;
    }

    getObjKeysLength(listBlocks): number {
        return Object.keys(listBlocks).length;
    }

    firstAnimateMenu() {
        clearTimeout(this.animateMenuTimeout);
        this.animateMenu = true;
        this.animateMenuTimeout = setTimeout(() => {
            this.animateMenu = false;
        }, 300 * 4);
    }
    switchMenuPos() {
        this.menuOnRight = !this.menuOnRight;
    }
    expand() {
        if (this.expandDetails.inProgress) {
            return;
        }
        this.expandDetails.inProgress = true;
        const el = this.dynamicLabelingRoom.nativeElement;
        const rect = el.getBoundingClientRect();
        const animation = 500;
        if (!this.expandDetails.expended) {
            const parent = el.parentElement;
            this.expandDetails.parent = parent;
            this.expandDetails.original = rect;
            el.style.width = rect.width + 'px';
            el.style.height = rect.height + 'px';
            requestAnimationFrame(() => {
                el.style.position = 'fixed';
                el.style.background = '#fff';
                el.style.zIndex = '9999';
                el.style.top = rect.top + 'px';
                el.style.left = rect.left + 'px';
                el.style.width = rect.width + 'px';
                el.style.height = rect.height + 'px';
                requestAnimationFrame(() => {
                    el.style.transition = 'all ' + animation + 'ms ease-in-out';
                    el.style.top = '0';
                    el.style.left = '0';
                    el.style.width = '100%';
                    el.style.height = '100%';
                    this.expandDetails.expended = true;
                    setTimeout(() => {
                        this.expandDetails.inProgress = false;
                    }, animation);
                });
            });
        } else {
            requestAnimationFrame(() => {
                el.style.top = this.expandDetails.original.top + 'px';
                el.style.left = this.expandDetails.original.left + 'px';
                el.style.width = this.expandDetails.original.width + 'px';
                el.style.height = this.expandDetails.original.height + 'px';
                setTimeout(() => {
                    el.style.transition = '';
                    el.style.position = '';
                    el.style.background = '';
                    el.style.zIndex = '';
                    el.style.top = '';
                    el.style.left = '';
                    el.style.width = '';
                    el.style.height = '';
                    this.expandDetails.expended = false;
                    this.expandDetails.inProgress = false;
                }, animation);
            });
        }
        // el.animate([
        //     {top: '0'},
        //     {left: '0'},
        //     {width: '100%'},
        //     {height: '100%'},
        // ], {
        //   duration: 1500,
        //   fill: 'forwards',
        // });
        // let transform = 'translateY(-' + rect.top + 'px)';
        // transform += ' translateX(-' + rect.left + 'px)';
        // transform += ' translateX(-' + rect.left + 'px)';
        // el.animate([
        //   // keyframes
        //   { transform: 'translateY(-' + rect.top + 'px)' + ' translateX(-' + rect.left + 'px)' }
        // ], {
        //   // timing options
        //   duration: 1000,
        //   easing: 'ease-in-out',
        //   fill: 'forwards',
        // });
    }

    setBlocksError(err) {
        this.blocksErrMessage = err;
    }
    resetBlocksError() {
        this.blocksErrMessage = '';
    }

    changeDetectorRefresh() {
        this.ref.markForCheck();
        this.ref.detectChanges();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.getWindowWidth()
    }

    @HostListener('window:keydown', ['$event'])
    onKeyPress($event: KeyboardEvent) {
        // if(($event.ctrlKey || $event.metaKey) && $event.keyCode == 86)
        //     console.log('CTRL +  V');
        if (this.enableHistory) {
            if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 90) {
                // console.log('CTRL +  Z');
                $event.preventDefault();
                this.ctrlZHistoryAction();
            }
            if (this.historyEnableCtrlY) {
                if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 89) {
                    // console.log('CTRL +  Y');
                    $event.preventDefault();
                    this.ctrlYHistoryAction();
                }
            }
        }
        // ctrl M - menu
        if (($event.altKey || $event.metaKey) && $event.keyCode === 77) {
            $event.preventDefault();
            this.switchMenuPos();
        }
        // ctrl E - expand
        if (($event.altKey || $event.metaKey) && $event.keyCode === 69) {
            $event.preventDefault();
            this.expand();
        }
        // ctrl T - template
        if (($event.altKey || $event.metaKey) && $event.keyCode === 84) {
            $event.preventDefault();
            this.changeTemplateType();
        }
    }

    getWindowWidth() {
        this.currentWindowWidth = window.innerWidth;
    }

    resetHistory() {
        this.history = [];
        this.historyIndex = 0;
    }

    addToHistory(action, object, ctrlZAction, objectY = null, ctrlYAction = null) {
        if (this.enableHistory) {
            if (this.historyEnableCtrlY) {
                if (this.history && this.history.length) {
                    this.history[this.history.length - 1].ctrlYAction = ctrlYAction;
                    this.history[this.history.length - 1].objectY = objectY;
                }
                if (this.history[this.historyIndex + 1]) {
                    this.history = this.history.slice(0, this.historyIndex);
                }
            }
            if (this.history.length >= this.historyLimit) {
                this.history.shift();
            }
            const obj = {
                action,
                object,
                ctrlZAction,
                ctrlYAction: null,
                objectY: null,
                // forwardAction: null,
            };
            if (this.history.length) {}
            this.history.push(obj);
            this.historyIndex++;
        }
    }

    ctrlZHistoryAction() {
        if (this.enableHistory) {
            let lastHistory;
            if (this.historyEnableCtrlY) {
                lastHistory = this.history[this.historyIndex - 1];
            } else {
                lastHistory = this.history.pop();
            }
            if (lastHistory) {
                this.historyIndex--;
                this[lastHistory.ctrlZAction](lastHistory.object);
                setTimeout(() => {
                    this.onChangeBlocks();
                });
            }
        }
    }
    ctrlYHistoryAction() {
        if (this.enableHistory && this.historyEnableCtrlY) {
            if (this.history && this.history.length && this.history[this.historyIndex - 1] && this.history[this.historyIndex - 1].ctrlYAction) {
                const lastHistory = this.history[this.historyIndex - 1];
                console.log('lastHistory', lastHistory)
                this.historyIndex++;
                this[lastHistory.ctrlYAction](lastHistory.objectY);
                setTimeout(() => {
                    this.onChangeBlocks();
                });
            }
        }
    }

    onKeyDown(obj) {
        this.addToHistory('keydown', obj, 'revertInputValue');
    }

    onClick(obj) {
        this.addToHistory('click', obj, 'revertInputValue');
    }

    revertInputValue(obj) {
        if (obj.i !== null && obj.i !== undefined) {
            obj.item.value[obj.i] = obj.lastValue;
        } else {
            obj.item.value = obj.lastValue;
        }
    }
}

export class DsProjectRoomBlock {
    blockName = ''; // the name of the block - will be presented as header in html
    blockDesc = ''; // the description of the block - will be presented under header in html
    blockWidth = ''; // width of the block in case we want two blocks to be in one row (must have next blocks complete width to 100%)
    blockWidthToPixel = ''; // responsive width of the block will stop when window is lower then pixels
    numColumns: number; // number of columns we want the fields to spread on
    fields: DsProjectRoomBlockField[] = []; // fields list inside the block
    isValid = true; // represent if the block is html valid

    constructor(obj?) {
        if (obj) {
            if (obj.blockName) {
                this.blockName = obj.blockName;
            }
            if (obj.blockDesc) {
                this.blockDesc = obj.blockDesc;
            }
            if (obj.blockWidth) {
                this.blockWidth = obj.blockWidth;
            }
            if (obj.blockWidthToPixel) {
                this.blockWidthToPixel = obj.blockWidthToPixel;
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
    label = ''; // will be used for html input name and label text
    description = ''; // description that will show as text under the field
    value: any = ''; // value of the field
    inputType = ''; // html input type (text,number,email,checkbox,textarea,select,select_multiple,radio,text_list(must come with listBlocks)
    required?: boolean; // html required
    pattern?: string; // html pattern
    listBlocks?: DsProjectRooomListBlocks[]; // for text-list type an array of DsProjectRooomListBlocks spread equal  on 100%
    depend: string; // determine when field depend on another field based on label name
    dependOnValue: any; // determine the true value (number, boolean, string, any compare using ===) when a field depend on another field
    breakLine: boolean; // boolean to force break line between fields
    fullLine: boolean; // boolean to force field to spread on full line
    center: boolean; // boolean to force field to be center of column
    options: any[]; // represent string select, select_multiple, radio options
    rows: number; // will be use only to set rows for textarea
    css: any; // represent specific style to a string

    constructor(obj?) {
        if (obj) {
            for (const key in obj) {
                if (key === 'listBlocks') {
                    for (const i in obj.listBlocks) {
                        obj.listBlocks[i] = new DsProjectRooomListBlocks(obj.listBlocks[i]);
                    }
                }
                if (obj[key] !== undefined && obj[key] !== null) {
                    const origKey = this.convertShortKey(key);
                    this[origKey] = obj[key];
                }
            }
        }
    }

    convertShortKey(key) {
        key === 'l' ? key = 'label' : ''; // will be used for html input name and label text
        key === 'd' ? key = 'description' : ''; // description that will show as text under the field
        key === 'v' ? key = 'value' : ''; // value of the field
        key === 'iT' ? key = 'inputType' : ''; // html input type (text,number,email,checkbox,textarea,select,select_multiple,radio,text_list(must come with listBlocks)
        key === 'r' ? key = 'required' : ''; // html required
        key === 'p' ? key = 'pattern' : ''; // html pattern
        key === 'lB' ? key = 'listBlocks' : ''; // for text-list type an array of DsProjectRooomListBlocks spread equal  on 100%
        key === 'de' ? key = 'depend' : ''; // determine when field depend on another field based on label name
        key === 'dOV' ? key = 'dependOnValue' : ''; // determine the true value (number, boolean, string, any compare using ===) when a field depend on another field
        key === 'bL' ? key = 'breakLine' : ''; // boolean to force break line between fields
        key === 'fL' ? key = 'fullLine' : ''; // boolean to force field to spread on full line
        key === 'c' ? key = 'center' : ''; // boolean to force field to be center of column
        key === 'o' ? key = 'options' : ''; // represent string select, select_multiple, radio options
        key === 'ro' ? key = 'rows' : ''; // will be use only to set rows for textarea
        key === 'cs' ? key = 'css' : ''; // represent specific style to a string
        return key;
    }
}

export class DsProjectRoomData {
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

export class DsProjectRooomListBlocks {
    label = ''; // will be used for html input name and label text
    description = ''; // description that will show as text under the field
    value: any = ''; // value of the field
    inputType = ''; // html input type (text,number,email,checkbox,textarea,select,select_multiple,radio,text_list(must come with listBlocks)
    required?: boolean; // html required
    pattern?: string; // html pattern

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
class OutputObj {
    blocks: DsProjectRoomBlock | DsProjectRoomBlock[]; // full output blocks to cache if needed
    cleanBlocks: any | any[]; // clean output blocks with only full fields
    valid: boolean; // represent if the list of items or one item is valid in order to alert the user
}

export class DsProjectRoomBlockShortField {
    l = ''; // will be used for html input name and label text
    d = ''; // description that will show as text under the field
    v: any = ''; // value of the field
    iT = ''; // html input type (text,number,email,checkbox,textarea,select,select_multiple,radio,text_list(must come with listBlocks)
    r?: boolean; // html required
    p?: string; // html pattern
    lB?: DsProjectRooomListBlocks[]; // for text-list type an array of DsProjectRooomListBlocks spread equal  on 100%
    de: string; // determine when field depend on another field based on label name
    dOV: any; // determine the true value (number, boolean, string, any compare using ===) when a field depend on another field
    bL: boolean; // boolean to force break line between fields
    fL: boolean; // boolean to force field to spread on full line
    c: boolean; // boolean to force field to be center of column
    o: any[]; // represent string select, select_multiple, radio options
    ro: number; // will be use only to set rows for textarea
    cs: any; // represent specific style to a string

    constructor(obj?) {
        if (obj) {
            for (const key in obj) {
                if (key === 'lO') {
                    for (const i in obj.lO) {
                        obj.lO[i] = new DsProjectRooomListBlocks(obj.lO[i]);
                    }
                }
                if (obj[key] !== undefined && obj[key] !== null) {
                    this[key] = obj[key];
                }
            }
        }
    }
}

