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
  private triggeredUp: boolean = false;
  private triggeredDown: boolean = false;
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
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  @HostListener('scroll', ['$event'])
  onScroll(e) {
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
        if(this.triggeredDown) {
          this.triggeredDown = false;
        }
      }
      const scrollDirection = this.elementCurrentScrollTop - this.lastScrollTop;
      if (this.element.nativeElement.scrollTop === 0) {
        this.element.nativeElement.scrollTop += 1;
      }
      // console.log('scrollDirection', scrollDirection)
      this.lastScrollTop = this.elementCurrentScrollTop;
      const distanceFromBottom = (this.elementScrollHeight - this.elementClientHeight) * ( 1 - this.angularInfinityScrollDownDistance / 100);
      const distanceFromUp = (this.elementScrollHeight - this.elementClientHeight) * (this.angularInfinityScrollUpDistance / 100);
      // console.log('this.elementCurrentScrollTop', this.elementCurrentScrollTop);
      // console.log('this.elementCurrentScrollTop', this.elementCurrentScrollTop);
      if (distanceFromBottom <= this.elementCurrentScrollTop && scrollDirection > 0) {
        this.scrolledDown.emit();
        this.triggeredDown = true;
        this.angularInfinityScrollDisabled = true;
        // setTimeout(() => {
        //   this.lastScrollTop = this.elementCurrentScrollTop;
        //   this.angularInfinityScrollDisabled = false;
        this.element.nativeElement.scrollTop += 1;
        // console.log(this.element.nativeElement.scrollTop)
        // });
      }
      if (this.elementCurrentScrollTop <= distanceFromUp && scrollDirection < 0) {
        this.scrolledUp.emit();
        this.triggeredUp = true;
        // this.element.nativeElement.scrollTop += 1;
        this.angularInfinityScrollDisabled = true;
        // setTimeout(() => {
        //   this.lastScrollTop = this.elementCurrentScrollTop;
        //   this.angularInfinityScrollDisabled = false;
        //   console.log('this.lastScrollTop', this.lastScrollTop)
        //   console.log('this.elementCurrentScrollTop', this.elementCurrentScrollTop)
        // if(this.lastScrollTop !== this.elementCurrentScrollTop) {
        //   this.element.nativeElement.scrollTop = (this.elementScrollHeight - this.elementClientHeight) - 1;
        // }
        // });
        //   // setTimeout(() => {
        //   //   this.angularInfinityScrollDisabled = false;
        //   // }, 100);
      }
    }
  }

}
