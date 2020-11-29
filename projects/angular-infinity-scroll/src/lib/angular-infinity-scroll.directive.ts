import {Directive, Input, OnInit, Output, EventEmitter, ElementRef, HostListener, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[angularInfinityScroll]'
})
export class AngularInfinityScrollDirective implements OnInit, OnChanges {

  @Input() angularInfinityScroll: string;
  @Input() angularInfinityScrollDownDistance: number;
  @Input() angularInfinityScrollUpDistance: number;
  // @Input() angularInfinityScrollThrottle: number;
  @Input() angularInfinityScrollDisabled: boolean;
  @Output() scrolledDown = new EventEmitter();
  @Output() scrolledUp = new EventEmitter();

  private elementScrollHeight;
  private elementClientHeight;
  private elementCurrentScrollTop;
  private lastScrollTop: number;
  private lastScrollDirection = 0;
  private triggeredUp = false;
  private triggeredDown = false;
  private mouseDown = false;
  private mouseDownPos: any = false;
  private lastScrollPos = 0;
  private scrollDirection = 0;
  private isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  private stopEventForFirefox = false;
  private keyUpDownPressed = false;
  constructor(
    private element: ElementRef
  ) { }

  ngOnInit(): void {
    this.elementScrollHeight = this.element.nativeElement.scrollHeight;
    this.elementClientHeight = this.element.nativeElement.clientHeight;
    this.elementCurrentScrollTop = this.element.nativeElement.scrollTop;
    this.lastScrollTop = this.elementCurrentScrollTop;
    if (!this.angularInfinityScrollDownDistance) {
      this.angularInfinityScrollDownDistance = 1.5;
    }
    if (!this.angularInfinityScrollUpDistance) {
      this.angularInfinityScrollUpDistance = 1.5;
    }
    if (!this.angularInfinityScrollDisabled) {
      this.angularInfinityScrollDisabled = false;
    }
    // console.log('directive works', this.elementCurrentScrollTop);

    // this.scrolledDown.emit()
    // this.scrolledUp.emit()
    this.element.nativeElement.setAttribute('tabIndex', 0);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  // @HostListener('mousedown', ['$event'])
  // mousedown(e) {
  //   this.mouseDown = true;
  // }

  // @HostListener('document:mouseup', ['$event'])
  // mouseup(e) {
  //   if (this.mouseDown) {
  //     this.mouseDown = false;
  //   }
  // }
  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event): void {
    this.mouseDown = true;
    this.mouseDownPos = this.getPointerPos(event, false);
    this.lastScrollPos = this.element.nativeElement.scrollTop;
  }

  @HostListener('keydown', ['$event'])
  onKeyPress(e): void {
    if (e.keyCode === 34 || e.keyCode === 33 || e.key === 'PageDown' || e.key === 'PageUp') {
      if (e.key === 'PageDown') {
        this.scrollDirection = 1;
      } else if (e.key === 'PageUp') {
        this.scrollDirection = -1;
      }
      this.handleScroll();
    }
  }

  @HostListener('window:mouseup', ['$event'])
  @HostListener('window:touchend', ['$event'])
  onMouseUp(event): void {
    if (this.mouseDown) {
      this.mouseDown = false;
    }
  }
  @HostListener('wheel', ['$event'])
  handleWheelEvent(event): void {
    // if (this.isFirefox) {
    this.scrollDirection = event.deltaY;
    this.handleScroll();
    // }
  }
  @HostListener('scroll', ['$event'])
  onScroll(e): void {
    if(this.keyUpDownPressed) {
      // this.keyUpDownPressed = false;
      // this.scrollDirection = 0;
      // this.scrollDirection = this.element.nativeElement.scrollTop - this.lastScrollPos;
      // this.handleScroll();
    }
    if (this.mouseDown) {
      // const direction = this.element.nativeElement.scrollTop - this.lastScrollPos;
      // this.scrollDirection  = direction;
      this.scrollDirection = 0;
      this.handleScroll();
    }
    if (!this.isFirefox) {
      // this.handleScroll();
    }
  }

  handleScroll(): void {
    setTimeout(() => {
      this.angularInfinityScrollDisabled = false;
    });
    if (!this.angularInfinityScrollDisabled) {
      this.elementScrollHeight = this.element.nativeElement.scrollHeight;
      this.elementClientHeight = this.element.nativeElement.clientHeight;
      this.elementCurrentScrollTop = this.element.nativeElement.scrollTop;
      if (this.triggeredUp || this.triggeredDown) {
        this.lastScrollTop = this.elementCurrentScrollTop;
        if (this.triggeredUp) {
          this.triggeredUp = false;
        }
        if (this.triggeredDown) {
          this.triggeredDown = false;
        }
      }
      let scrollDirection = this.elementCurrentScrollTop - this.lastScrollTop;
      if (!scrollDirection) {
        scrollDirection = this.lastScrollDirection;
      }
      if (this.scrollDirection) {
        scrollDirection = this.scrollDirection;
      }
      this.lastScrollDirection = scrollDirection;
      // console.log('scrollDirection', scrollDirection)
      this.lastScrollTop = this.elementCurrentScrollTop;
      const distanceFromBottom = (this.elementScrollHeight - this.elementClientHeight) / 2 * (this.angularInfinityScrollDownDistance / 100);
      const distanceFromUp = (this.elementScrollHeight - this.elementClientHeight) / 2 * (this.angularInfinityScrollUpDistance / 100);
      console.log('(this.elementScrollHeight - this.elementClientHeight)', (this.elementScrollHeight - this.elementClientHeight));
      console.log('scrollDirection', scrollDirection);
      console.log('distanceFromBottom', distanceFromBottom);
      console.log('distanceFromUp', distanceFromUp);
      console.log('this.elementScrollHeight', (this.elementScrollHeight - this.elementClientHeight) - distanceFromBottom);
      console.log('this.elementCurrentScrollTop', this.elementCurrentScrollTop);
      if ((this.elementScrollHeight - this.elementClientHeight) - distanceFromBottom <= this.elementCurrentScrollTop && scrollDirection > 0) {
        this.scrolledDown.emit();
        this.triggeredDown = true;
        if (!this.mouseDown) {
          // this.angularInfinityScrollDisabled = true;
        }
        if (Math.ceil(this.elementCurrentScrollTop) === (this.elementScrollHeight - this.elementClientHeight)) {
          setTimeout(() => {
            if (this.element.nativeElement.scrollTop === 0) {
              this.element.nativeElement.scrollTop += 1;
              // this.angularInfinityScrollDisabled = true;
            }
            if (this.element.nativeElement.scrollTop === (this.element.nativeElement.scrollHeight - this.element.nativeElement.clientHeight)) {
              // this.element.nativeElement.scrollTop -= 1;
            }
          });
        }
      }
      if (this.elementCurrentScrollTop <= distanceFromUp && scrollDirection < 0) {
        this.scrolledUp.emit();
        this.triggeredUp = true;
        // this.element.nativeElement.scrollTop += 1;
        if (!this.mouseDown) {
          // this.angularInfinityScrollDisabled = true;
        }
        if (this.element.nativeElement.scrollTop === 0) {
          this.element.nativeElement.scrollTop += 1;
          // this.angularInfinityScrollDisabled = true;
          setTimeout(() => {
            if (this.element.nativeElement.scrollTop === 0) {
              this.element.nativeElement.scrollTop += 1;
              // this.angularInfinityScrollDisabled = true;
            }
            if (this.element.nativeElement.scrollTop === (this.element.nativeElement.scrollHeight - this.element.nativeElement.clientHeight)) {
              this.element.nativeElement.scrollTop -= 1;
            }
          });
        }
      }
    }
  }

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
      x,
      y
    };
  }

}
