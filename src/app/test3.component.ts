import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-test',
  template: `
    <div>{{title}}</div>
  `
})
export class Test3Component implements OnInit {
  public title = 'hello test 3';

  constructor() {

  }

  ngOnInit() {
  }
}
