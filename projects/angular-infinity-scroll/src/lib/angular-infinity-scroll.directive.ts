import {Directive, Input, OnInit, Output, EventEmitter, ElementRef, HostListener, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[angularInfinityScroll]'
})
export class AngularInfinityScrollDirective implements OnInit, OnChanges {

  @Input() angularInfinityScroll: string;
  @Input() angularInfinityScrollDownDistance: number;
  @Input() angularInfinityScrollUpDistance: number;
  @Input() angularInfinityScrollLeftDistance: number;
  @Input() angularInfinityScrollRightDistance: number;
  // @Input() angularInfinityScrollThrottle: number;
  @Input() angularInfinityScrollDisabled: boolean;
  @Output() scrolledDown = new EventEmitter();
  @Output() scrolledUp = new EventEmitter();
  @Output() scrolledLeft = new EventEmitter();
  @Output() scrolledRight = new EventEmitter();

  private elementScrollHeight;
  private elementClientHeight;
  private elementScrollWidth;
  private elementClientWidth;
  private elementCurrentScrollTop;
  private elementCurrentScrollLeft;
  private lastScrollTop: number;
  private lastScrollLeft: number;
  private lastScrollDirection = 0;
  private lastScrollDirectionHorizontal = 0;
  private triggeredUp = false;
  private triggeredDown = false;
  private triggeredLeft = false;
  private triggeredRight = false;
  private mouseDown = false;
  private mouseDownPos: any = false;
  private lastScrollPos = 0;
  private scrollDirection = 0;
  private isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  private isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1 && navigator.userAgent.toLowerCase().indexOf('chrome') === -1;
  private stopEventForFirefox = false;
  private keyUpDownPressed = false;
  constructor(
    private element: ElementRef
  ) { }

  ngOnInit(): void {
    this.elementScrollHeight = this.element.nativeElement.scrollHeight;
    this.elementClientHeight = this.element.nativeElement.clientHeight;
    this.elementScrollWidth = this.element.nativeElement.scrollWidth;
    this.elementClientWidth = this.element.nativeElement.clientWidth;
    this.elementCurrentScrollTop = this.element.nativeElement.scrollTop;
    this.lastScrollTop = this.elementCurrentScrollTop;
    this.lastScrollLeft = this.elementCurrentScrollLeft;
    if (!this.angularInfinityScrollDownDistance) {
      this.angularInfinityScrollDownDistance = 1.5;
    }
    if (!this.angularInfinityScrollUpDistance) {
      this.angularInfinityScrollUpDistance = 1.5;
    }
    if (!this.angularInfinityScrollLeftDistance) {
      this.angularInfinityScrollLeftDistance = 1.5;
    }
    if (!this.angularInfinityScrollRightDistance) {
      this.angularInfinityScrollRightDistance = 1.5;
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
    this.lastScrollLeft = this.element.nativeElement.scrollLeft;
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
    // console.log('asdf', event.webkitDirectionInvertedFromDevice)
    // console.log('asdf', event)
    this.handleScroll();
    // }
  }
  @HostListener('scroll', ['$event'])
  onScroll(e): void {
    if(this.isSafari) {
      return;
    }
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
      this.elementScrollWidth = this.element.nativeElement.scrollWidth;
      this.elementClientWidth = this.element.nativeElement.clientWidth;
      this.elementCurrentScrollTop = this.element.nativeElement.scrollTop;
      this.elementCurrentScrollLeft = this.element.nativeElement.scrollLeft;
      if (this.triggeredUp || this.triggeredDown) {
        this.lastScrollTop = this.elementCurrentScrollTop;
        if (this.triggeredUp) {
          this.triggeredUp = false;
        }
        if (this.triggeredDown) {
          this.triggeredDown = false;
        }
        if (this.triggeredLeft) {
          this.triggeredLeft = false;
        }
        if (this.triggeredRight) {
          this.triggeredRight = false;
        }
      }
      let scrollDirection = this.elementCurrentScrollTop - this.lastScrollTop;
      let scrollDirectionHorizontal = this.elementCurrentScrollLeft - this.lastScrollLeft;
      console.log('scrollDirectionHorizontal', scrollDirectionHorizontal)
      if (!scrollDirection) {
        scrollDirection = this.lastScrollDirection;
      }
      if (!scrollDirectionHorizontal) {
        scrollDirectionHorizontal = this.lastScrollDirectionHorizontal;
      }
      if (this.scrollDirection) {
        scrollDirection = this.scrollDirection;
      }
      this.lastScrollDirection = scrollDirection;
      this.lastScrollDirectionHorizontal = scrollDirectionHorizontal;
      // console.log('scrollDirection', scrollDirection)
      this.lastScrollTop = this.elementCurrentScrollTop;
      this.lastScrollLeft = this.elementCurrentScrollLeft;
      const distanceFromBottom = (this.elementScrollHeight - this.elementClientHeight) / 2 * (this.angularInfinityScrollDownDistance / 100);
      const distanceFromUp = (this.elementScrollHeight - this.elementClientHeight) / 2 * (this.angularInfinityScrollUpDistance / 100);
      const distanceFromLeft = (this.elementScrollWidth - this.elementClientWidth) / 2 * (this.angularInfinityScrollLeftDistance / 100);
      const distanceFromRight = (this.elementScrollWidth - this.elementClientWidth) / 2 * (this.angularInfinityScrollRightDistance / 100);

      // console.log('(this.elementScrollHeight - this.elementClientHeight)', (this.elementScrollHeight - this.elementClientHeight));
      // console.log('scrollDirection', scrollDirection);
      // console.log('distanceFromBottom', distanceFromBottom);
      // console.log('distanceFromUp', distanceFromUp);
      // console.log('this.elementScrollHeight', (this.elementScrollHeight - this.elementClientHeight) - distanceFromBottom);
      // console.log('this.elementCurrentScrollTop', this.elementCurrentScrollTop);
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
      if ((this.elementScrollWidth - this.elementClientWidth) - distanceFromRight <= this.elementCurrentScrollLeft && scrollDirectionHorizontal > 0) {
        this.scrolledRight.emit();
        this.triggeredRight = true;
        if (!this.mouseDown) {
          // this.angularInfinityScrollDisabled = true;
        }
        if (Math.ceil(this.elementCurrentScrollLeft) === (this.elementScrollWidth - this.elementClientWidth)) {
          setTimeout(() => {
            if (this.element.nativeElement.scrollLeft === 0) {
              this.element.nativeElement.scrollLeft += 1;
              // this.angularInfinityScrollDisabled = true;
            }
            if (Math.ceil(this.elementCurrentScrollLeft) === (this.element.nativeElement.scrollWidth - this.element.nativeElement.clientWidth)) {
              this.element.nativeElement.scrollLeft -= 1;
            }
          });
        }
      }
      if (this.elementCurrentScrollLeft <= distanceFromLeft && scrollDirectionHorizontal < 0) {
        this.scrolledLeft.emit();
        this.triggeredLeft = true;
        // this.element.nativeElement.scrollTop += 1;
        if (!this.mouseDown) {
          // this.angularInfinityScrollDisabled = true;
        }
        if (this.element.nativeElement.scrollLeft === 0) {
          this.element.nativeElement.scrollLeft += 1;
          // this.angularInfinityScrollDisabled = true;
          setTimeout(() => {
            if (this.element.nativeElement.scrollLeft === 0) {
              this.element.nativeElement.scrollLeft += 1;
              // this.angularInfinityScrollDisabled = true;
            }
            if (this.element.nativeElement.scrollLeft === (this.element.nativeElement.scrollWidth - this.element.nativeElement.clientWidth)) {
              this.element.nativeElement.scrollLeft -= 1;
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
