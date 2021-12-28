import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-test',
  template: `
    <div>{{title}}</div>
  `
})
export class Test2Component implements OnInit {
  public title = 'hello test 2';

  constructor() {

  }

  ngOnInit() {
  }
}
