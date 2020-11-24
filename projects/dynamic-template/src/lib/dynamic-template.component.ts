import {Component, HostListener, Inject, Input, OnDestroy, OnInit, ViewChild, EventEmitter} from '@angular/core';
import {DynamicTemplateService} from './dynamic-template.service';
import {DOCUMENT} from '@angular/common';
import {AlertService} from './alert.service';
import { faExpand, faCog, faSyncAlt, faSave, faRetweet, faColumns } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lib-dynamic-template',
  templateUrl: './dynamic-template.html',
  styleUrls: ['./dynamic-template.less']
})
export class DynamicTemplateComponent implements OnInit, OnDestroy {

  @ViewChild('playground') playground: any;
  @ViewChild('scroller') scroller: any;
  @ViewChild('smallMenu') smallMenu: any;
  public defaultSettings = {
    firstComponent: '',
    secondComponent: '',
    thirdComponent: '',
    onDrag: new EventEmitter(),
    css: {
      position: 'absolute',
      margin: ['0px','0px','0px','0px'],
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: '100%'
    }
  };
  @Input() settings: any;
  public dragDefault: any;
  public resetViewAnimate = false;
  public dragStarted = false;
  public modelType = '';
  public resultsType: string;
  public icons = {
    faExpand: faExpand,
    faCog: faCog,
    faSyncAlt: faSyncAlt,
    faSave: faSave,
    faRetweet: faRetweet,
    faColumns: faColumns,
  };
  public drag: any = {
    version: 1,
    // all numbers are percent values
    firstBox: {
      mousedown: false,
      height: '',
      top: 0,
      bottom: 66.5,
      right: 0,
      left: 0,
      marginLeft: 0,
      marginRight: 0,
      zIndex: 0,
      startPos: null,
      target: null,
      type: null,
      dragBars: [
        {type: 'bottom,left,right', position: 'bottom'}
      ],
      expended: false,
      onMove: {
        currentPos: 'top',
        top: false,
        bottom: 'bottom',
        left: false,
        right: false,
      }
    },
    thirdBox: {
      mousedown: false,
      height: '',
      top: 33.5,
      bottom: 0,
      right: 0,
      left: 50,
      marginLeft: 1,
      marginRight: 0,
      zIndex: 1,
      startPos: null,
      target: null,
      type: null,
      dragBars: [
        {type: 'top,left', position: 'top'},
        {type: 'left,top', position: 'left'}
      ],
      expended: false,
      onMove: {
        currentPos: 'bottom-right',
        top: 'top',
        bottom: false,
        left: 'left',
        right: false,
      }
    },
    secondBox: {
      mousedown: false,
      height: '',
      top: 33.5,
      bottom: 0,
      right: 50,
      left: 0,
      marginLeft: 0,
      marginRight: 1,
      zIndex: 1,
      startPos: null,
      target: null,
      type: null,
      dragBars: [
        {type: 'top,right', position: 'top'},
        {type: 'right,top', position: 'right'}
      ],
      expended: false,
      onMove: {
        currentPos: 'bottom-left',
        top: 'top',
        bottom: false,
        left: false,
        right: 'right',
      }
    },
    minTop: 0,
    maxTop: 100,
    minLeft: 0,
    maxLeft: 100,
    playgroundHeight: 91,
  };
  public drag1: any = {
    version: 2,
    // all numbers are percent values
    firstBox: {
      mousedown: false,
      height: '',
      top: 0,
      bottom: 50,
      right: 50,
      left: 0,
      marginLeft: 0,
      marginRight: 0,
      zIndex: 1,
      startPos: null,
      target: null,
      type: null,
      dragBars: [
        {type: 'right,top,bottom', position: 'right'},
        {type: 'right,top,bottom', position: 'bottom'}
      ],
      expended: false,
      onMove: {
        currentPos: 'left-top',
        top: false,
        bottom: 'bottom',
        left: false,
        right: 'right',
      }
    },
    thirdBox: {
      mousedown: false,
      height: '',
      top: 0,
      bottom: 0,
      right: 0,
      left: 50,
      marginLeft: 0,
      marginRight: 0,
      zIndex: 0,
      startPos: null,
      target: null,
      type: null,
      dragBars: [
        {type: 'left,bottom,top', position: 'left'}
      ],
      expended: false,
      onMove: {
        currentPos: 'right',
        top: false,
        bottom: false,
        left: 'left',
        right: false,
      }
    },
    secondBox: {
      mousedown: false,
      height: '',
      top: 50,
      bottom: 0,
      right: 50,
      left: 0,
      marginLeft: 0,
      marginRight: 0,
      zIndex: 1,
      startPos: null,
      target: null,
      type: null,
      dragBars: [
        {type: 'right,top,bottom', position: 'right'},
        {type: 'top,right,bottom', position: 'top'}
      ],
      expended: false,
      onMove: {
        currentPos: 'left-bottom',
        top: 'top',
        bottom: false,
        left: false,
        right: 'right',
      }
    },
    minTop: 0,
    maxTop: 100,
    minLeft: 0,
    maxLeft: 100,
    playgroundHeight: 91,
  };

  public smallMenuExpanded = false;

  public viewOptions = [
    {from: 'secondBox', to: 'firstBox', active: false},
    {from: 'firstBox', to: 'thirdBox', active: false},
    {from: 'firstBox', to: 'secondBox', active: false},
    {from: 'thirdBox', to: 'secondBox', active: false},
    {from: 'firstBox', to: 'thirdBox', active: false},
  ];
  public templateOptions = [
    JSON.parse(JSON.stringify(this.drag)),
    JSON.parse(JSON.stringify(this.drag1))
  ];
  public currentViewIndex = 0;
  public currentTemplateIndex = 0;
  constructor(
    private dynamicTemplateService: DynamicTemplateService,
    private alertService: AlertService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    const lastState = this.getState();
    if (lastState) {
      this.drag = lastState;
    }
    // this.changeTemplate();
    this.dragDefault = JSON.parse(JSON.stringify(this.drag));

    this.dynamicTemplateService.ListenFor('onExpand').subscribe((name) => {
      this.setExpand(name);
    });
    this.dynamicTemplateService.ListenFor('onResetView').subscribe(() => {
      if (this.checkOneItemIsExpand()) {
        this.resetView();
        return;
      }
    });

    this.loadSettings();
  }

  loadSettings() {
    if (this.settings) {
      console.log('this.settings',this.settings)
      if (this.settings.firstComponent) {
        this.defaultSettings.firstComponent = this.settings.firstComponent;
      }
     if (this.settings.secondComponent) {
        this.defaultSettings.secondComponent = this.settings.secondComponent;
      }
      if (this.settings.thirdComponent) {
        this.defaultSettings.thirdComponent = this.settings.thirdComponent;
      }
      if (this.settings.onDrag) {
        this.defaultSettings.onDrag = this.settings.onDrag;
      }
    }
  }

  setExpand(name: string): void {
    if (this.checkOneItemIsExpand()) {
      this.resetView();
      return;
    }
    this.drag.firstBox.expended = false;
    this.drag.secondBox.expended = false;
    this.drag.thirdBox.expended = false;
    this.resetAllDrag();
    if (name === 'firstBox') {
      this.expandFirstBox();
    }
    if (name === 'thirdBox') {
      this.expandThirdBox();
    }
    if (name === 'secondBox') {
      this.expandSecondBox();
    }
    this.resetViewAnimate = true;
    setTimeout(() => {
      this.resetViewAnimate = false;
    }, 300);
  }

  resetAllDrag(): void {
    if (this.drag.firstBox.onMove.bottom) {
      this.drag.firstBox[this.drag.firstBox.onMove.bottom] = this.drag.maxTop;
    }
    if (this.drag.thirdBox.onMove.bottom) {
      this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] = this.drag.maxTop;
    }
    if (this.drag.secondBox.onMove.bottom) {
      this.drag.secondBox[this.drag.secondBox.onMove.bottom] = this.drag.maxTop;
    }
    if (this.drag.firstBox.onMove.top) {
      this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.minTop;
    }
    if (this.drag.thirdBox.onMove.top) {
      this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.drag.minTop;
    }
    if (this.drag.secondBox.onMove.top) {
      this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.minTop;
    }
    if (this.drag.firstBox.onMove.left) {
      this.drag.firstBox[this.drag.firstBox.onMove.left] = this.drag.maxLeft + this.drag.firstBox.marginLeft;
    }
    if (this.drag.thirdBox.onMove.left) {
      this.drag.thirdBox[this.drag.thirdBox.onMove.left] = this.drag.maxLeft + this.drag.thirdBox.marginLeft;
    }
    if (this.drag.secondBox.onMove.left) {
      this.drag.secondBox[this.drag.secondBox.onMove.left] = this.drag.maxLeft + this.drag.secondBox.marginLeft;
    }
    if (this.drag.firstBox.onMove.right) {
      this.drag.firstBox[this.drag.firstBox.onMove.right] = this.drag.maxLeft + this.drag.firstBox.marginRight;
    }
    if (this.drag.thirdBox.onMove.right) {
      this.drag.thirdBox[this.drag.thirdBox.onMove.right] = this.drag.maxLeft + this.drag.thirdBox.marginRight;
    }
    if (this.drag.secondBox.onMove.right) {
      this.drag.secondBox[this.drag.secondBox.onMove.right] = this.drag.maxLeft + this.drag.secondBox.marginRight;
    }
  }

  expandFirstBox(): void {
    if (this.drag.firstBox.onMove.currentPos === 'top') {
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.thirdBox.onMove.left) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.left] = this.dragDefault.thirdBox.left;
      }
      if (this.drag.secondBox.onMove.left) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] = this.dragDefault.secondBox.left;
      }
      if (this.drag.thirdBox.onMove.right) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.right] = this.dragDefault.thirdBox.right;
      }
      if (this.drag.secondBox.onMove.right) {
        this.drag.secondBox[this.drag.secondBox.onMove.right] = this.dragDefault.secondBox.right;
      }
    }
    else if (this.drag.firstBox.onMove.currentPos === 'left-top') {
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.thirdBox.onMove.left) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.left] = this.drag.maxLeft;
      }
      if (this.drag.secondBox.onMove.left) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] = this.drag.maxLeft;
      }
      if (this.drag.thirdBox.onMove.right) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.right] = this.drag.minLeft;
      }
      if (this.drag.secondBox.onMove.right) {
        this.drag.secondBox[this.drag.secondBox.onMove.right] = this.drag.minLeft;
      }
    }
    else if (this.drag.firstBox.onMove.currentPos === 'left-bottom') {
      if (this.drag.secondBox.onMove.right) {
        this.drag.secondBox[this.drag.secondBox.onMove.right] = this.drag.minLeft;
      }
      if (this.drag.thirdBox.onMove.right) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.right] = this.drag.minLeft;
      }
    }
    else if (this.drag.firstBox.onMove.currentPos === 'right') {
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.dragDefault.secondBox.top;
      }
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.dragDefault.thirdBox.top;
      }
      if (this.drag.secondBox.onMove.bottom) {
        this.drag.secondBox[this.drag.secondBox.onMove.bottom] = this.dragDefault.secondBox.bottom;
      }
      if (this.drag.thirdBox.onMove.bottom) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] = this.dragDefault.thirdBox.bottom;
      }
    }
    if (this.drag.firstBox.onMove.top) {
      this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.minTop;
    }
    if (this.drag.firstBox.onMove.bottom) {
      this.drag.firstBox[this.drag.firstBox.onMove.bottom] = this.drag.minTop;
    }
    if (this.drag.firstBox.onMove.left) {
      this.drag.firstBox[this.drag.firstBox.onMove.left] = this.drag.minLeft - this.drag.firstBox.marginLeft;
    }
    if (this.drag.firstBox.onMove.right) {
      this.drag.firstBox[this.drag.firstBox.onMove.right] = this.drag.minLeft - this.drag.firstBox.marginRight;
    }
    // this.drag.firstBox.height = this.drag.firstBox.maximizeHeight;
    // this.drag.thirdBox.top = this.drag.thirdBox.minimizeTop;
    // this.drag.thirdBox.left = this.dragDefault.thirdBox.left;
    // this.drag.secondBox.top = this.drag.secondBox.minimizeTop;
    // this.drag.secondBox.right = this.dragDefault.secondBox.right;
    this.drag.firstBox.expended = true;
  }
  expandThirdBox(): void {
    if (this.drag.thirdBox.onMove.currentPos === 'top') {
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.firstBox.onMove.left) {
        this.drag.firstBox[this.drag.firstBox.onMove.left] = this.dragDefault.firstBox.left;
      }
      if (this.drag.secondBox.onMove.left) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] = this.dragDefault.secondBox.left;
      }
      if (this.drag.firstBox.onMove.right) {
        this.drag.firstBox[this.drag.firstBox.onMove.right] = this.dragDefault.firstBox.right;
      }
      if (this.drag.secondBox.onMove.right) {
        this.drag.secondBox[this.drag.secondBox.onMove.right] = this.dragDefault.secondBox.right;
      }
    }
    else if (this.drag.thirdBox.onMove.currentPos === 'left-top') {
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.secondBox.onMove.right) {
        this.drag.secondBox[this.drag.secondBox.onMove.right] = this.drag.minLeft;
      }
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.firstBox.onMove.right) {
        this.drag.firstBox[this.drag.firstBox.onMove.right] = this.drag.minLeft;
      }
    }
    else if (this.drag.thirdBox.onMove.currentPos === 'left-bottom') {
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.minTop;
      }
      if (this.drag.secondBox.onMove.right) {
        this.drag.secondBox[this.drag.secondBox.onMove.right] = this.drag.minLeft;
      }
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.minTop;
      }
      if (this.drag.firstBox.onMove.right) {
        this.drag.firstBox[this.drag.firstBox.onMove.right] = this.drag.minLeft;
      }
    }
    else if (this.drag.thirdBox.onMove.currentPos === 'right') {
      this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.drag.maxTop;
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.dragDefault.firstBox.top;
      }
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.dragDefault.secondBox.top;
      }
      if (this.drag.firstBox.onMove.bottom) {
        this.drag.firstBox[this.drag.firstBox.onMove.bottom] = this.dragDefault.firstBox.bottom;
      }
      if (this.drag.secondBox.onMove.bottom) {
        this.drag.secondBox[this.drag.secondBox.onMove.bottom] = this.dragDefault.secondBox.bottom;
      }
      if (this.drag.firstBox.onMove.left) {
        this.drag.firstBox[this.drag.firstBox.onMove.left] = this.drag.minLeft;
      }
      if (this.drag.secondBox.onMove.left) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] = this.drag.minLeft;
      }
      if (this.drag.firstBox.onMove.right) {
        this.drag.firstBox[this.drag.firstBox.onMove.right] = this.drag.maxLeft;
      }
      if (this.drag.secondBox.onMove.right) {
        this.drag.secondBox[this.drag.secondBox.onMove.right] = this.drag.maxLeft;
      }
    }
    if (this.drag.thirdBox.onMove.top) {
      this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.drag.minTop;
    }
    if (this.drag.thirdBox.onMove.bottom) {
      this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] = this.drag.minTop;
    }
    if (this.drag.thirdBox.onMove.left) {
      this.drag.thirdBox[this.drag.thirdBox.onMove.left] = this.drag.minLeft - this.drag.thirdBox.marginLeft;
    }
    if (this.drag.thirdBox.onMove.right) {
      this.drag.thirdBox[this.drag.thirdBox.onMove.right] = this.drag.minLeft - this.drag.thirdBox.marginRight;
    }
    // this.drag.firstBox.height = this.drag.firstBox.minimizeHeight;
    // this.drag.thirdBox.top = this.drag.thirdBox.maximizeTop;
    // this.drag.thirdBox.left = this.drag.thirdBox.maximizeLeft;
    // this.drag.secondBox.top = this.drag.secondBox.maximizeTop;
    // this.drag.secondBox.right = this.drag.secondBox.minimizeRight;
    this.drag.thirdBox.expended = true;
  }
  expandSecondBox(): void {
    if (this.drag.secondBox.onMove.currentPos === 'top') {
      // this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.maxTop;
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.firstBox.onMove.left) {
        this.drag.firstBox[this.drag.firstBox.onMove.left] = this.dragDefault.firstBox.left;
      }
      if (this.drag.thirdBox.onMove.left) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.left] = this.dragDefault.thirdBox.left;
      }
      if (this.drag.firstBox.onMove.right) {
        this.drag.firstBox[this.drag.firstBox.onMove.right] = this.dragDefault.firstBox.right;
      }
      if (this.drag.thirdBox.onMove.right) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.right] = this.dragDefault.thirdBox.right;
      }
    }
    else if (this.drag.secondBox.onMove.currentPos === 'left-top') {
      if (this.drag.firstBox.onMove.right) {
        this.drag.firstBox[this.drag.firstBox.onMove.right] = this.drag.minLeft;
      }
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.thirdBox.onMove.right) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.right] = this.drag.minLeft;
      }
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.drag.maxTop;
      }
    }
    else if (this.drag.secondBox.onMove.currentPos === 'left-bottom') {
      if (this.drag.firstBox.onMove.bottom) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.minTop;
      }
      if (this.drag.thirdBox.onMove.bottom) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.drag.minTop;
      }
      if (this.drag.firstBox.onMove.right) {
        this.drag.firstBox[this.drag.firstBox.onMove.right] = this.drag.minLeft;
      }
      if (this.drag.thirdBox.onMove.right) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.right] = this.drag.minLeft;
      }
    }
    else if (this.drag.secondBox.onMove.currentPos === 'right') {
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.dragDefault.thirdBox.top;
      }
      if (this.drag.thirdBox.onMove.bottom) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] = this.dragDefault.thirdBox.bottom;
      }
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.dragDefault.firstBox.top;
      }
      if (this.drag.firstBox.onMove.bottom) {
        this.drag.firstBox[this.drag.firstBox.onMove.bottom] = this.dragDefault.firstBox.bottom;
      }
    }
    if (this.drag.secondBox.onMove.top) {
      this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.minTop;
    }
    if (this.drag.secondBox.onMove.bottom) {
      this.drag.secondBox[this.drag.secondBox.onMove.bottom] = this.drag.minTop;
    }
    if (this.drag.secondBox.onMove.left) {
      this.drag.secondBox[this.drag.secondBox.onMove.left] = this.drag.minLeft - this.drag.secondBox.marginLeft;
    }
    if (this.drag.secondBox.onMove.right) {
      this.drag.secondBox[this.drag.secondBox.onMove.right] = this.drag.minLeft - this.drag.secondBox.marginRight;
    }
    // this.drag.firstBox.height = this.drag.firstBox.minimizeHeight;
    // this.drag.thirdBox.top = this.drag.thirdBox.maximizeTop;
    // this.drag.thirdBox.left = this.drag.thirdBox.minimizeLeft;
    // this.drag.secondBox.top = this.drag.secondBox.maximizeTop;
    // this.drag.secondBox.right = this.drag.secondBox.maximizeRight;
    this.drag.secondBox.expended = true;
  }

  checkOneItemIsExpand(): boolean {
    return this.checkFirstBoxIsExpand() || this.checkThirdBoxIsExpand() || this.checkSecondBoxIsExpand();
  }

  checkFirstBoxIsExpand(): boolean {
    let results = true;
    // if (this.drag.firstBox.onMove.top === 'height') {
    //     results = results || this.drag.firstBox[this.drag.firstBox.onMove.top] === this.drag.maxTop;
    // }
    // if (this.drag.firstBox.onMove.top || this.drag.firstBox.onMove.bottom) {
    if (this.drag.firstBox.onMove.top) {
      results = results && this.drag.firstBox[this.drag.firstBox.onMove.top] === this.drag.minTop;
    }
    if (this.drag.firstBox.onMove.bottom) {
      results = results && this.drag.firstBox[this.drag.firstBox.onMove.bottom] === this.drag.minTop;
    }
    if (this.drag.firstBox.onMove.left) {
      results = results &&
        (this.drag.firstBox[this.drag.firstBox.onMove.left] === this.drag.minLeft - this.drag.firstBox.marginLeft);
    }
    if (this.drag.firstBox.onMove.right) {
      results = results &&
        (this.drag.firstBox[this.drag.firstBox.onMove.right] === this.drag.minLeft - this.drag.firstBox.marginRight);
    }
    // }
    return results;
  }
  checkThirdBoxIsExpand(): boolean {
    let results = true;
    // if (this.drag.thirdBox.onMove.top === 'height') {
    //     results = results || this.drag.thirdBox[this.drag.thirdBox.onMove.top] === this.drag.maxTop;
    // }
    // if (this.drag.thirdBox.onMove.top || this.drag.thirdBox.onMove.bottom) {
    if (this.drag.thirdBox.onMove.top) {
      results = results && this.drag.thirdBox[this.drag.thirdBox.onMove.top] === this.drag.minTop;
    }
    if (this.drag.thirdBox.onMove.bottom) {
      results = results && this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] === this.drag.minTop;
    }
    if (this.drag.thirdBox.onMove.left) {
      results = results &&
        (this.drag.thirdBox[this.drag.thirdBox.onMove.left] === this.drag.minLeft - this.drag.thirdBox.marginLeft);
    }
    if (this.drag.thirdBox.onMove.right) {
      results = results &&
        (this.drag.thirdBox[this.drag.thirdBox.onMove.right] === this.drag.minLeft - this.drag.thirdBox.marginRight);
    }
    // }
    return results;
  }
  checkSecondBoxIsExpand(): boolean {
    let results = true;
    // if (this.drag.secondBox.onMove.top === 'height') {
    //     results = results || this.drag.secondBox[this.drag.secondBox.onMove.top] === this.drag.maxTop;
    // }
    // if (this.drag.secondBox.onMove.top || this.drag.secondBox.onMove.bottom) {
    if (this.drag.secondBox.onMove.top) {
      results = results && this.drag.secondBox[this.drag.secondBox.onMove.top] === this.drag.minTop;
    }
    if (this.drag.secondBox.onMove.bottom) {
      results = results && this.drag.secondBox[this.drag.secondBox.onMove.bottom] === this.drag.minTop;
    }
    if (this.drag.secondBox.onMove.left) {
      results = results &&
        (this.drag.secondBox[this.drag.secondBox.onMove.left] === this.drag.minLeft - this.drag.secondBox.marginLeft);
    }
    if (this.drag.secondBox.onMove.right) {
      results = results &&
        (this.drag.secondBox[this.drag.secondBox.onMove.right] === this.drag.minLeft - this.drag.secondBox.marginRight);
    }
    // }
    return results;
  }
  onMouseDown(e: any, name: string, type: string): void {
    const pos = this.dynamicTemplateService.getPointerPos(e, false);
    this.drag[name].mousedown = true;
    this.drag[name].startPos = pos;
    // this.drag[name].target = e.target;
    this.drag[name].type = type;
    this.dragStarted = true;
    if (this.defaultSettings.onDrag) {
      this.defaultSettings.onDrag.emit(this.dragStarted);
    }
    this.document.body.classList.add('disable-mobile-refresh');
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onMouseUp(e): void {
    if (this.drag.firstBox.mousedown) {
      this.drag.firstBox.mousedown = false;
      this.drag.firstBox.startPos = null;
    }
    if (this.drag.thirdBox.mousedown) {
      this.drag.thirdBox.mousedown = false;
      this.drag.thirdBox.startPos = null;
    }
    if (this.drag.secondBox.mousedown) {
      this.drag.secondBox.mousedown = false;
      this.drag.secondBox.startPos = null;
    }
    this.dragStarted = false;
    if (this.defaultSettings.onDrag) {
      this.defaultSettings.onDrag.emit(this.dragStarted);
    }
    this.document.body.classList.remove('disable-mobile-refresh');
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onMouseMove(e): void {
    let type = '';
    if (this.drag.firstBox.mousedown) {
      type = 'firstBox';
    }
    if (this.drag.thirdBox.mousedown) {
      type = 'thirdBox';
    }
    if (this.drag.secondBox.mousedown) {
      type = 'secondBox';
    }
    if (!type) {
      return;
    }
    e.preventDefault();
    const pos = this.dynamicTemplateService.getPointerPos(e, false);
    const moveX = pos.x - this.drag[type].startPos.x;
    const moveY = pos.y - this.drag[type].startPos.y;
    const moveXPercent = moveX / this.playground.nativeElement.clientWidth * 100;
    const moveYPercent = moveY / this.playground.nativeElement.clientHeight * 100;
    // if (this.drag[type].onMove.currentPos === 'top') {
    //     moveYPercent = -moveYPercent;
    // }
    if (this.drag.version === 1) {
      this.onMoveVersion1(type, moveXPercent, moveYPercent);
    } else if (this.drag.version === 2) {
      this.onMoveVersion1(type, moveXPercent, moveYPercent);
    } else if (this.drag.version === 3) {
      this.onMoveVersion3(type, moveXPercent, moveYPercent);
    }
    this.onMoveLimitTopBottom();
    this.onMoveLimitLeft();
    this.onMoveLimitRight();

    // if (this.drag.firstBox.height < 0) {
    //     this.drag.firstBox.height = 0;
    //     this.drag.thirdBox.top = this.drag.minTop;
    //     this.drag.secondBox.top = this.drag.minTop;
    // }
    // if (this.drag.firstBox.height > this.drag.maxTop) {
    //     this.drag.firstBox.height = this.drag.maxTop;
    //     this.drag.thirdBox.top = 100;
    //     this.drag.secondBox.top = 100;
    // }
    // if (this.drag.thirdBox.left < this.drag.minLeft - this.drag.thirdBox.marginLeft) {
    //     this.drag.thirdBox.left = this.drag.minLeft - this.drag.thirdBox.marginLeft;
    //     this.drag.secondBox.right = this.drag.maxLeft + this.drag.thirdBox.marginLeft;
    // }
    // if (this.drag.thirdBox.left > this.drag.maxLeft + this.drag.thirdBox.marginLeft) {
    //     this.drag.thirdBox.left = this.drag.maxLeft + this.drag.thirdBox.marginLeft;
    //     this.drag.secondBox.right = this.drag.minLeft - this.drag.secondBox.marginRight;
    // }
    this.drag[type].startPos = pos;
  }

  onMoveVersion1(type, moveXPercent, moveYPercent): void {
    if (this.drag[type].type.indexOf('bottom') > -1) {
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] += moveYPercent;
      }
      if (this.drag.firstBox.onMove.bottom) {
        this.drag.firstBox[this.drag.firstBox.onMove.bottom] -= moveYPercent;
      }
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] += moveYPercent;
      }
      if (this.drag.thirdBox.onMove.bottom) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] -= moveYPercent;
      }
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] += moveYPercent;
      }
      if (this.drag.secondBox.onMove.bottom) {
        this.drag.secondBox[this.drag.secondBox.onMove.bottom] -= moveYPercent;
      }
    }
    else if (this.drag[type].type.indexOf('top') > -1) {
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] += moveYPercent;
      }
      if (this.drag.firstBox.onMove.bottom) {
        this.drag.firstBox[this.drag.firstBox.onMove.bottom] -= moveYPercent;
      }
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] += moveYPercent;
      }
      if (this.drag.thirdBox.onMove.bottom) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] -= moveYPercent;
      }
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] += moveYPercent;
      }
      if (this.drag.secondBox.onMove.bottom) {
        this.drag.secondBox[this.drag.secondBox.onMove.bottom] -= moveYPercent;
      }
    }
    if (this.drag[type].type.indexOf('left') > -1) {
      // this.drag.thirdBox.left += moveXPercent;
      // this.drag.secondBox.right -= moveXPercent;
      if (this.drag.firstBox.onMove.left) {
        this.drag.firstBox[this.drag.firstBox.onMove.left] += moveXPercent;
      }
      if (this.drag.firstBox.onMove.right) {
        this.drag.firstBox[this.drag.firstBox.onMove.right] -= moveXPercent;
      }
      if (this.drag.thirdBox.onMove.left) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.left] += moveXPercent;
      }
      if (this.drag.thirdBox.onMove.right) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.right] -= moveXPercent;
      }
      if (this.drag.secondBox.onMove.left) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] += moveXPercent;
      }
      if (this.drag.secondBox.onMove.right) {
        this.drag.secondBox[this.drag.secondBox.onMove.right] -= moveXPercent;
      }
    }
    else if (this.drag[type].type.indexOf('right') > -1) {
      // this.drag.thirdBox.left += moveXPercent;
      // this.drag.secondBox.right -= moveXPercent;
      if (this.drag.firstBox.onMove.left) {
        this.drag.firstBox[this.drag.firstBox.onMove.left] += moveXPercent;
      }
      if (this.drag.firstBox.onMove.right) {
        this.drag.firstBox[this.drag.firstBox.onMove.right] -= moveXPercent;
      }
      if (this.drag.thirdBox.onMove.left) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.left] += moveXPercent;
      }
      if (this.drag.thirdBox.onMove.right) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.right] -= moveXPercent;
      }
      if (this.drag.secondBox.onMove.left) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] += moveXPercent;
      }
      if (this.drag.secondBox.onMove.right) {
        this.drag.secondBox[this.drag.secondBox.onMove.right] -= moveXPercent;
      }
    }
  }
  onMoveVersion3(type, moveXPercent, moveYPercent): void {
    let moveLeft = false;
    let moveRight = false;
    if (moveXPercent < 0) {
      moveLeft = true;
    } else {
      moveRight = true;
    }
    const datasetInMiddle = this.drag.firstBox.onMove.left && this.drag.firstBox.onMove.right;
    const thirdBoxInMiddle = this.drag.thirdBox.onMove.left && this.drag.thirdBox.onMove.right;
    const viewInMiddle = this.drag.secondBox.onMove.left && this.drag.secondBox.onMove.right;
    if (this.drag[type].type.indexOf('left') > -1) {
      // this.drag.thirdBox.left += moveXPercent;
      // this.drag.secondBox.right -= moveXPercent;
      if (this.drag.firstBox.onMove.left) {
        this.drag.firstBox[this.drag.firstBox.onMove.left] += moveXPercent;
      }
      if (this.drag.firstBox.onMove.right) {
        this.drag.firstBox[this.drag.firstBox.onMove.right] -= moveXPercent;
      }
      if (this.drag.thirdBox.onMove.left) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.left] += moveXPercent;
      }
      if (this.drag.thirdBox.onMove.right) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.right] -= moveXPercent;
      }
      if (this.drag.secondBox.onMove.left) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] += moveXPercent;
      }
      if (this.drag.secondBox.onMove.right) {
        this.drag.secondBox[this.drag.secondBox.onMove.right] -= moveXPercent;
      }
    }
    if (this.drag[type].type.indexOf('right') > -1) {
      // this.drag.thirdBox.left += moveXPercent;
      // this.drag.secondBox.right -= moveXPercent;
      if (this.drag.firstBox.onMove.left) {
        this.drag.firstBox[this.drag.firstBox.onMove.left] += moveXPercent;
      }
      if (this.drag.firstBox.onMove.right) {
        this.drag.firstBox[this.drag.firstBox.onMove.right] -= moveXPercent;
      }
      if (this.drag.thirdBox.onMove.left) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.left] += moveXPercent;
      }
      if (this.drag.thirdBox.onMove.right) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.right] -= moveXPercent;
      }
      if (this.drag.secondBox.onMove.left) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] += moveXPercent;
      }
      if (this.drag.secondBox.onMove.right) {
        this.drag.secondBox[this.drag.secondBox.onMove.right] -= moveXPercent;
      }
    }
  }
  onMoveLimitTopBottom(): void {
    if (this.drag.firstBox.onMove.top) {
      if (this.drag.firstBox[this.drag.firstBox.onMove.top] < 0) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = 0;
      }
      if (this.drag.firstBox[this.drag.firstBox.onMove.top] > this.drag.maxTop) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.maxTop;
      }
    }
    if (this.drag.firstBox.onMove.bottom) {
      if (this.drag.firstBox[this.drag.firstBox.onMove.bottom] < 0) {
        this.drag.firstBox[this.drag.firstBox.onMove.bottom] = 0;
      }
      if (this.drag.firstBox[this.drag.firstBox.onMove.bottom] > this.drag.maxTop) {
        this.drag.firstBox[this.drag.firstBox.onMove.bottom] = this.drag.maxTop;
      }
    }
    if (this.drag.thirdBox.onMove.top) {
      if (this.drag.thirdBox[this.drag.thirdBox.onMove.top] < 0) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = 0;
      }
      if (this.drag.thirdBox[this.drag.thirdBox.onMove.top] > this.drag.maxTop) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.drag.maxTop;
      }
    }
    if (this.drag.thirdBox.onMove.bottom) {
      if (this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] < 0) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] = 0;
      }
      if (this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] > this.drag.maxTop) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] = this.drag.maxTop;
      }
    }
    if (this.drag.secondBox.onMove.top) {
      if (this.drag.secondBox[this.drag.secondBox.onMove.top] < 0) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = 0;
      }
      if (this.drag.secondBox[this.drag.secondBox.onMove.top] > this.drag.maxTop) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.maxTop;
      }
    }
    if (this.drag.secondBox.onMove.bottom) {
      if (this.drag.secondBox[this.drag.secondBox.onMove.bottom] < 0) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = 0;
      }
      if (this.drag.secondBox[this.drag.secondBox.onMove.bottom] > this.drag.maxTop) {
        this.drag.secondBox[this.drag.secondBox.onMove.bottom] = this.drag.maxTop;
      }
    }
  }
  onMoveLimitLeft(): void {
    if (this.drag.firstBox.onMove.left) {
      if (this.drag.firstBox[this.drag.firstBox.onMove.left] < this.drag.minLeft - this.drag.firstBox.marginLeft) {
        this.drag.firstBox[this.drag.firstBox.onMove.left] = this.drag.minLeft - this.drag.firstBox.marginLeft;
      }
      if (this.drag.firstBox[this.drag.firstBox.onMove.left] > this.drag.maxLeft + this.drag.firstBox.marginLeft) {
        this.drag.firstBox[this.drag.firstBox.onMove.left] = this.drag.maxLeft + this.drag.firstBox.marginLeft;
      }
    }
    if (this.drag.thirdBox.onMove.left) {
      if (this.drag.thirdBox[this.drag.thirdBox.onMove.left] < this.drag.minLeft - this.drag.thirdBox.marginLeft) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.left] = this.drag.minLeft - this.drag.thirdBox.marginLeft;
      }
      if (this.drag.thirdBox[this.drag.thirdBox.onMove.left] > this.drag.maxLeft + this.drag.thirdBox.marginLeft) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.left] = this.drag.maxLeft + this.drag.thirdBox.marginLeft;
      }
    }
    if (this.drag.secondBox.onMove.left) {
      if (this.drag.secondBox[this.drag.secondBox.onMove.left] < this.drag.minLeft - this.drag.secondBox.marginLeft) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] = this.drag.minLeft - this.drag.secondBox.marginLeft;
      }
      if (this.drag.secondBox[this.drag.secondBox.onMove.left] > this.drag.maxLeft + this.drag.secondBox.marginLeft) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] = this.drag.maxLeft + this.drag.secondBox.marginLeft;
      }
    }
  }
  onMoveLimitRight(): void {
    if (this.drag.firstBox.onMove.right) {
      if (this.drag.firstBox[this.drag.firstBox.onMove.right] > this.drag.maxLeft + this.drag.firstBox.marginRight) {
        this.drag.firstBox[this.drag.firstBox.onMove.right] = this.drag.maxLeft + this.drag.firstBox.marginRight;
      }
      if (this.drag.firstBox[this.drag.firstBox.onMove.right] < this.drag.minLeft - this.drag.firstBox.marginRight) {
        this.drag.firstBox[this.drag.firstBox.onMove.right] = this.drag.minLeft - this.drag.firstBox.marginRight;
      }
    }
    if (this.drag.thirdBox.onMove.right) {
      if (this.drag.thirdBox[this.drag.thirdBox.onMove.right] > this.drag.maxLeft + this.drag.thirdBox.marginRight) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.right] = this.drag.maxLeft + this.drag.thirdBox.marginRight;
      }
      if (this.drag.thirdBox[this.drag.thirdBox.onMove.right] < this.drag.minLeft - this.drag.thirdBox.marginRight) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.right] = this.drag.minLeft - this.drag.thirdBox.marginRight;
      }
    }
    if (this.drag.secondBox.onMove.right) {
      if (this.drag.secondBox[this.drag.secondBox.onMove.right] > this.drag.maxLeft + this.drag.secondBox.marginRight) {
        this.drag.secondBox[this.drag.secondBox.onMove.right] = this.drag.maxLeft + this.drag.secondBox.marginRight;
      }
      if (this.drag.secondBox[this.drag.secondBox.onMove.right] < this.drag.minLeft - this.drag.secondBox.marginRight) {
        this.drag.secondBox[this.drag.secondBox.onMove.right] = this.drag.minLeft - this.drag.secondBox.marginRight;
      }
    }
  }

  resetView(): void {
    this.resetViewAnimate = true;
    this.drag = JSON.parse(JSON.stringify(this.dragDefault));
    setTimeout(() => {
      this.resetViewAnimate = false;
    }, 300);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.setPlaygroundHeight(event.target.innerWidth);
  }

  setPlaygroundHeight(width): void {
    if (width < 576) {
      this.drag.playgroundHeight = 83;
    } else {
      this.drag.playgroundHeight = 91;
    }
    this.dragDefault.playgroundHeight = this.drag.playgroundHeight;
  }

  saveState(): void {
    localStorage.setItem('state', JSON.stringify(this.drag));
    this.dragDefault = JSON.parse(JSON.stringify(this.drag));
    this.alertService.success('state successfully saved');
  }
  getState(): any {
    let currentState = localStorage.getItem('state');
    if (currentState) {
      currentState = JSON.parse(currentState);
      // this.helpersService.extendObjects(currentState, this.drag);
    }
    return currentState;
  }

  changeComponentOrder(): void {
    if (this.checkOneItemIsExpand()) {
      this.resetView();
    }
    if (this.currentViewIndex < this.viewOptions.length - 1) {
      this.currentViewIndex++;
    } else {
      this.currentViewIndex = 0;
    }
    this.resetViewAnimate = true;
    setTimeout(() => {
      this.resetViewAnimate = false;
    }, 300);
    this.changeViewDynamically(this.viewOptions[this.currentViewIndex]);
  }

  changeViewDynamically(obj): void {
    const copy = Object.assign({}, this.drag[obj.from]);
    this.drag[obj.from].height = this.drag[obj.to].height;
    this.drag[obj.from].top = this.drag[obj.to].top;
    this.drag[obj.from].left = this.drag[obj.to].left;
    this.drag[obj.from].right = this.drag[obj.to].right;
    this.drag[obj.from].bottom = this.drag[obj.to].bottom;
    this.drag[obj.from].marginLeft = this.drag[obj.to].marginLeft;
    this.drag[obj.from].marginRight = this.drag[obj.to].marginRight;
    this.drag[obj.from].dragBars = this.drag[obj.to].dragBars;
    this.drag[obj.from].onMove = this.drag[obj.to].onMove;

    this.drag[obj.to].height = copy.height;
    this.drag[obj.to].top = copy.top;
    this.drag[obj.to].left = copy.left;
    this.drag[obj.to].right = copy.right;
    this.drag[obj.to].bottom = copy.bottom;
    this.drag[obj.to].marginLeft = copy.marginLeft;
    this.drag[obj.to].marginRight = copy.marginRight;
    this.drag[obj.to].dragBars = copy.dragBars;
    this.drag[obj.to].onMove = copy.onMove;
    this.dragDefault = JSON.parse(JSON.stringify(this.drag));
  }

  changeTemplateType(): void {
    if (this.checkOneItemIsExpand()) {
      this.resetView();
    }
    if (this.currentTemplateIndex < this.templateOptions.length - 1) {
      this.currentTemplateIndex++;
    } else {
      this.currentTemplateIndex = 0;
    }
    this.resetViewAnimate = true;
    setTimeout(() => {
      this.resetViewAnimate = false;
    }, 300);
    this.drag = JSON.parse(JSON.stringify(this.templateOptions[this.currentTemplateIndex]));
    this.dragDefault = JSON.parse(JSON.stringify(this.drag));
  }
  toggleSmallMenu(): void {
    this.smallMenuExpanded = !this.smallMenuExpanded;
  }

  @HostListener('document:mousedown', ['$event'])
  @HostListener('document:wheel', ['$event'])
  onDocClick(event): void {
    if (!this.smallMenu.nativeElement.contains(event.target)) {
      if (this.smallMenuExpanded) {
        this.toggleSmallMenu();
      }
    }
  }

  ngOnDestroy(): void {
    this.dynamicTemplateService.ClearAllEvents();
  }

}
