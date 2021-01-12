import {Component, HostListener, Inject, Input, OnDestroy, OnInit, ViewChild, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {DynamicTemplateService} from './dynamic-template.service';
import {DOCUMENT} from '@angular/common';
// import {AlertService} from './alert.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'lib-dynamic-template',
  templateUrl: './dynamic-template.html',
  styleUrls: ['./dynamic-template.less']
})
export class DynamicTemplateComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('playground') playground: any;
  @ViewChild('scroller') scroller: any;
  @ViewChild('smallMenu') smallMenu: any;
  public defaultSettings: any = {
    firstComponent: '',
    firstComponentInputs: new Observable<any>(),
    secondComponent: '',
    secondComponentInputs: new Observable<any>(),
    thirdComponent: '',
    thirdComponentInputs: new Observable<any>(),
    onDrag: new EventEmitter(),
    onClick: new EventEmitter(),
    css: {
      position: 'absolute',
      margin: ['0px', '0px', '0px', '0px'],
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      maxWidth: '100%',
      height: '100%'
    },
    icons: {
      expand: '',
      cog: '',
      syncAlt: '',
      save: '',
      retweet: '',
      columns: '',
    },
    stateLabel: ''
  };
  @Input() settings: any;
  public dragDefault: any;
  public resetViewAnimate = false;
  public dragStarted = false;
  public modelType = '';
  public resultsType: string;
  public drag: any = {
    version: 1,
    // all numbers are percent values
    firstBox: {
      mousedown: false,
      height: '',
      top: 0,
      bottom: 50,
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
      top: 50,
      bottom: 0,
      right: 0,
      left: 50,
      marginLeft: 0,
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
      zIndex: 0,
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
      zIndex: 1,
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
      zIndex: 2,
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
  public drag2: any = {
    version: 3,
    // all numbers are percent values
    firstBox: {
      mousedown: false,
      height: '',
      top: 50,
      bottom: 0,
      right: 0,
      left: 0,
      marginLeft: 0,
      marginRight: 0,
      zIndex: 2,
      startPos: null,
      target: null,
      type: null,
      dragBars: [
        {type: 'right,left,top', position: 'top'}
      ],
      expended: false,
      onMove: {
        currentPos: 'bottom',
        top: 'top',
        bottom: false,
        left: false,
        right: false,
      }
    },
    thirdBox: {
      mousedown: false,
      height: '',
      top: 0,
      bottom: 50,
      right: 0,
      left: 50,
      marginLeft: 0,
      marginRight: 0,
      zIndex: 1,
      startPos: null,
      target: null,
      type: null,
      dragBars: [
        {type: 'bottom,left', position: 'bottom'},
        {type: 'left,bottom', position: 'left'}
      ],
      expended: false,
      onMove: {
        currentPos: 'top-right',
        top: false,
        bottom: 'bottom',
        left: 'left',
        right: false,
      }
    },
    secondBox: {
      mousedown: false,
      height: '',
      top: 0,
      bottom: 50,
      right: 50,
      left: 0,
      marginLeft: 0,
      marginRight: 0,
      zIndex: 0,
      startPos: null,
      target: null,
      type: null,
      dragBars: [
        {type: 'bottom,right', position: 'bottom'},
        {type: 'right,bottom', position: 'right'}
      ],
      expended: false,
      onMove: {
        currentPos: 'top-left',
        top: false,
        bottom: 'bottom',
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
  public drag3: any = {
    version: 2,
    // all numbers are percent values
    firstBox: {
      mousedown: false,
      height: '',
      top: 0,
      bottom: 50,
      right: 0,
      left: 50,
      marginLeft: 0,
      marginRight: 0,
      zIndex: 1,
      startPos: null,
      target: null,
      type: null,
      dragBars: [
        {type: 'left,top,bottom', position: 'left'},
        {type: 'left,top,bottom', position: 'bottom'}
      ],
      expended: false,
      onMove: {
        currentPos: 'right-top',
        top: false,
        bottom: 'bottom',
        left: 'left',
        right: false,
      }
    },
    thirdBox: {
      mousedown: false,
      height: '',
      top: 0,
      bottom: 0,
      right: 50,
      left: 0,
      marginLeft: 0,
      marginRight: 0,
      zIndex: 0,
      startPos: null,
      target: null,
      type: null,
      dragBars: [
        {type: 'right,bottom,top', position: 'right'}
      ],
      expended: false,
      onMove: {
        currentPos: 'left',
        top: false,
        bottom: false,
        left: false,
        right: 'right',
      }
    },
    secondBox: {
      mousedown: false,
      height: '',
      top: 50,
      bottom: 0,
      right: 0,
      left: 50,
      marginLeft: 0,
      marginRight: 0,
      zIndex: 2,
      startPos: null,
      target: null,
      type: null,
      dragBars: [
        {type: 'left,top,bottom', position: 'left'},
        {type: 'top,left,bottom', position: 'top'}
      ],
      expended: false,
      onMove: {
        currentPos: 'right-bottom',
        top: 'top',
        bottom: false,
        left: 'left',
        right: false,
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
    JSON.parse(JSON.stringify(this.drag1)),
    JSON.parse(JSON.stringify(this.drag2)),
    JSON.parse(JSON.stringify(this.drag3))
  ];
  public currentViewIndex = 0;
  public currentTemplateIndex = 0;
  private document: Document;
  constructor(
    private dynamicTemplateService: DynamicTemplateService,
    // private alertService: AlertService,
    @Inject(DOCUMENT) document?: any
  ) {
    this.document = document as Document;
  }

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
  }

  loadSettings(): void {
    if (this.settings) {
      if (this.settings.firstComponent) {
        this.defaultSettings.firstComponent = this.settings.firstComponent;
      }
      if (this.settings.secondComponent) {
        this.defaultSettings.secondComponent = this.settings.secondComponent;
      }
      if (this.settings.thirdComponent) {
        this.defaultSettings.thirdComponent = this.settings.thirdComponent;
      }
      this.settings.firstComponentInputs.disableWebsiteControl = this.dragStarted;
      this.settings.secondComponentInputs.disableWebsiteControl = this.dragStarted;
      this.settings.thirdComponentInputs.disableWebsiteControl = this.dragStarted;
      if (this.settings.firstComponentInputs &&
        JSON.stringify(this.settings.firstComponentInputs) !== JSON.stringify(this.defaultSettings.firstComponentInputs)) {
        this.defaultSettings.firstComponentInputs = {...this.settings.firstComponentInputs};
      }
      if (this.settings.secondComponentInputs &&
        JSON.stringify(this.settings.secondComponentInputs) !== JSON.stringify(this.defaultSettings.secondComponentInputs)) {
        this.defaultSettings.secondComponentInputs = {...this.settings.secondComponentInputs};
      }
      if (this.settings.thirdComponentInputs &&
        JSON.stringify(this.settings.thirdComponentInputs) !== JSON.stringify(this.defaultSettings.thirdComponentInputs)) {
        this.defaultSettings.thirdComponentInputs = {...this.settings.thirdComponentInputs};
      }
      if (this.settings.onDrag) {
        this.defaultSettings.onDrag = this.settings.onDrag;
      }
      if (this.settings.onClick) {
        this.defaultSettings.onClick = this.settings.onClick;
      }
      if (this.settings.css) {
        if (this.settings.css.position) {
          this.defaultSettings.css.position = this.settings.css.position;
        }
        if (this.settings.css.margin) {
          this.defaultSettings.css.margin = this.settings.css.margin;
        }
        if (this.settings.css.top) {
          this.defaultSettings.css.top = this.settings.css.top;
        }
        if (this.settings.css.left) {
          this.defaultSettings.css.left = this.settings.css.left;
        }
        if (this.settings.css.right) {
          this.defaultSettings.css.right = this.settings.css.right;
        }
        if (this.settings.css.bottom) {
          this.defaultSettings.css.bottom = this.settings.css.bottom;
        }
        if (this.settings.css.height) {
          this.defaultSettings.css.height = this.settings.css.height;
        }
        if (this.settings.css.maxWidth) {
          this.defaultSettings.css.maxWidth = this.settings.css.maxWidth;
        }
      }
      if (this.settings.icons) {
        if (this.settings.icons.expand) {
          this.defaultSettings.icons.expand = this.settings.icons.expand;
        }
        if (this.settings.icons.cog) {
          this.defaultSettings.icons.cog = this.settings.icons.cog;
        }
        if (this.settings.icons.syncAlt) {
          this.defaultSettings.icons.syncAlt = this.settings.icons.syncAlt;
        }
        if (this.settings.icons.save) {
          this.defaultSettings.icons.save = this.settings.icons.save;
        }
        if (this.settings.icons.retweet) {
          this.defaultSettings.icons.retweet = this.settings.icons.retweet;
        }
        if (this.settings.icons.columns) {
          this.defaultSettings.icons.columns = this.settings.icons.columns;
        }
      }
      if(this.settings.stateLabel) {
        this.defaultSettings.stateLabel = this.settings.stateLabel;
      }
      // console.log('this.settings', this.settings)
      // console.log('this.defaultSettings', this.defaultSettings)
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
    else if (this.drag.firstBox.onMove.currentPos === 'bottom') {
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
    } else if (this.drag.firstBox.onMove.currentPos === 'top-right') {
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.secondBox.onMove.bottom) {
        this.drag.secondBox[this.drag.secondBox.onMove.bottom] = this.drag.minTop;
      }
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.thirdBox.onMove.bottom) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] = this.drag.minTop;
      }
    } else if (this.drag.firstBox.onMove.currentPos === 'top-left') {
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.secondBox.onMove.bottom) {
        this.drag.secondBox[this.drag.secondBox.onMove.bottom] = this.drag.minTop;
      }
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.thirdBox.onMove.bottom) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] = this.drag.minTop;
      }
    } else if (this.drag.firstBox.onMove.currentPos === 'right-top') {
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.secondBox.onMove.left) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] = this.drag.minLeft;
      }
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.thirdBox.onMove.left) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.left] = this.drag.minLeft;
      }
    } else if (this.drag.firstBox.onMove.currentPos === 'right-bottom') {
      if (this.drag.secondBox.onMove.bottom) {
        this.drag.secondBox[this.drag.secondBox.onMove.bottom] = this.drag.maxTop;
      }
      if (this.drag.secondBox.onMove.left) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] = this.drag.minLeft;
      }
      if (this.drag.thirdBox.onMove.bottom) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] = this.drag.maxTop;
      }
      if (this.drag.thirdBox.onMove.left) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.left] = this.drag.minLeft;
      }
    } else if (this.drag.firstBox.onMove.currentPos === 'left') {
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.dragDefault.secondBox.top;
      }
      if (this.drag.secondBox.onMove.bottom) {
        this.drag.secondBox[this.drag.secondBox.onMove.bottom] = this.dragDefault.secondBox.bottom;
      }
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.dragDefault.thirdBox.top;
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
    else if (this.drag.thirdBox.onMove.currentPos === 'bottom') {
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
    } else if (this.drag.thirdBox.onMove.currentPos === 'top-right') {
      if (this.drag.secondBox.onMove.bottom) {
        this.drag.secondBox[this.drag.secondBox.onMove.bottom] = this.drag.minTop;
      }
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.firstBox.onMove.bottom) {
        this.drag.firstBox[this.drag.firstBox.onMove.bottom] = this.drag.minTop;
      }
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.maxTop;
      }
    } else if (this.drag.thirdBox.onMove.currentPos === 'top-left') {
      if (this.drag.secondBox.onMove.bottom) {
        this.drag.secondBox[this.drag.secondBox.onMove.bottom] = this.drag.minTop;
      }
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.firstBox.onMove.bottom) {
        this.drag.firstBox[this.drag.firstBox.onMove.bottom] = this.drag.minTop;
      }
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.maxTop;
      }
    } else if (this.drag.thirdBox.onMove.currentPos === 'right-top') {
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.secondBox.onMove.left) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] = this.drag.minLeft;
      }
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.firstBox.onMove.left) {
        this.drag.firstBox[this.drag.firstBox.onMove.left] = this.drag.minLeft;
      }
    } else if (this.drag.thirdBox.onMove.currentPos === 'right-bottom') {
      if (this.drag.firstBox.onMove.bottom) {
        this.drag.firstBox[this.drag.firstBox.onMove.bottom] = this.drag.maxTop;
      }
      if (this.drag.firstBox.onMove.left) {
        this.drag.firstBox[this.drag.firstBox.onMove.left] = this.drag.minLeft;
      }
      if (this.drag.secondBox.onMove.bottom) {
        this.drag.secondBox[this.drag.secondBox.onMove.bottom] = this.drag.maxTop;
      }
      if (this.drag.secondBox.onMove.left) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] = this.drag.minLeft;
      }
    } else if (this.drag.thirdBox.onMove.currentPos === 'left') {
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.dragDefault.firstBox.top;
      }
      if (this.drag.firstBox.onMove.bottom) {
        this.drag.firstBox[this.drag.firstBox.onMove.bottom] = this.dragDefault.firstBox.bottom;
      }
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.dragDefault.secondBox.top;
      }
      if (this.drag.secondBox.onMove.bottom) {
        this.drag.secondBox[this.drag.secondBox.onMove.bottom] = this.dragDefault.secondBox.bottom;
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
    else if (this.drag.secondBox.onMove.currentPos === 'bottom') {
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
    } else if (this.drag.secondBox.onMove.currentPos === 'top-left') {
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.firstBox.onMove.bottom) {
        this.drag.firstBox[this.drag.firstBox.onMove.bottom] = this.drag.minTop;
      }
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.thirdBox.onMove.bottom) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] = this.drag.minTop;
      }
    } else if (this.drag.secondBox.onMove.currentPos === 'top-right') {
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.firstBox.onMove.bottom) {
        this.drag.firstBox[this.drag.firstBox.onMove.bottom] = this.drag.minTop;
      }
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.thirdBox.onMove.bottom) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] = this.drag.minTop;
      }
    } else if (this.drag.secondBox.onMove.currentPos === 'right-top') {
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.firstBox.onMove.left) {
        this.drag.firstBox[this.drag.firstBox.onMove.left] = this.drag.minLeft;
      }
      if (this.drag.secondBox.onMove.top) {
        this.drag.secondBox[this.drag.secondBox.onMove.top] = this.drag.maxTop;
      }
      if (this.drag.secondBox.onMove.left) {
        this.drag.secondBox[this.drag.secondBox.onMove.left] = this.drag.minLeft;
      }
    } else if (this.drag.secondBox.onMove.currentPos === 'right-bottom') {
      if (this.drag.firstBox.onMove.bottom) {
        this.drag.firstBox[this.drag.firstBox.onMove.bottom] = this.drag.maxTop;
      }
      if (this.drag.firstBox.onMove.left) {
        this.drag.firstBox[this.drag.firstBox.onMove.left] = this.drag.minLeft;
      }
      if (this.drag.thirdBox.onMove.bottom) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] = this.drag.maxTop;
      }
      if (this.drag.thirdBox.onMove.left) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.left] = this.drag.minLeft;
      }
    } else if (this.drag.secondBox.onMove.currentPos === 'left') {
      if (this.drag.firstBox.onMove.top) {
        this.drag.firstBox[this.drag.firstBox.onMove.top] = this.dragDefault.firstBox.top;
      }
      if (this.drag.firstBox.onMove.bottom) {
        this.drag.firstBox[this.drag.firstBox.onMove.bottom] = this.dragDefault.firstBox.bottom;
      }
      if (this.drag.thirdBox.onMove.top) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.top] = this.dragDefault.thirdBox.top;
      }
      if (this.drag.thirdBox.onMove.bottom) {
        this.drag.thirdBox[this.drag.thirdBox.onMove.bottom] = this.dragDefault.thirdBox.bottom;
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

  emitDragStarted() {
    // this.defaultSettings.firstComponentInputs['disableWebsiteControl'] = this.dragStarted;
    // this.defaultSettings.secondComponentInputs['disableWebsiteControl'] = this.dragStarted;
    // this.defaultSettings.thirdComponentInputs['disableWebsiteControl'] = this.dragStarted;
    if (this.defaultSettings.onDrag) {
      this.defaultSettings.onDrag.emit(this.dragStarted);
    }
  }
  onMouseDown(e: any, name: string, type: string): void {
    const pos = this.dynamicTemplateService.getPointerPos(e, false);
    this.drag[name].mousedown = true;
    this.drag[name].startPos = pos;
    // this.drag[name].target = e.target;
    this.drag[name].type = type;
    this.dragStarted = true;
    this.emitDragStarted();
    this.document.body.classList.add('disable-mobile-refresh');
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onMouseUp(e): void {
    if (this.dragStarted) {
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
      this.emitDragStarted();
      this.document.body.classList.remove('disable-mobile-refresh');
    }
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
      this.onMoveVersion1(type, moveXPercent, moveYPercent);
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
        this.drag.secondBox[this.drag.secondBox.onMove.bottom] = 0;
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
    localStorage.setItem('state' + (this.defaultSettings.stateLabel ? '-' + this.defaultSettings.stateLabel : ''), JSON.stringify(this.drag));
    this.dragDefault = JSON.parse(JSON.stringify(this.drag));
    // this.alertService.success('state successfully saved');
    this.defaultSettings.onClick.emit({type: 'state', msg: 'state successfully saved'});
  }
  getState(): any {
    let currentState = localStorage.getItem('state' + (this.defaultSettings.stateLabel ? '-' + this.defaultSettings.stateLabel : ''));
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
    this.drag[obj.from].zIndex = this.drag[obj.to].zIndex;
    this.drag[obj.from].dragBars = this.drag[obj.to].dragBars;
    this.drag[obj.from].onMove = this.drag[obj.to].onMove;

    this.drag[obj.to].height = copy.height;
    this.drag[obj.to].top = copy.top;
    this.drag[obj.to].left = copy.left;
    this.drag[obj.to].right = copy.right;
    this.drag[obj.to].bottom = copy.bottom;
    this.drag[obj.to].marginLeft = copy.marginLeft;
    this.drag[obj.to].marginRight = copy.marginRight;
    this.drag[obj.to].zIndex = copy.zIndex;
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

  ngOnChanges(changes: SimpleChanges): void {
    this.loadSettings();
  }

  ngOnDestroy(): void {
    this.dynamicTemplateService.ClearAllEvents();
  }

}
