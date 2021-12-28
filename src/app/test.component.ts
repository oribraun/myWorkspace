import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-test',
  template: `
    <div>{{title}} - {{test}}</div>
  `
})
export class TestComponent implements OnInit {
  public title = 'hello test';
  @Input() test: string;
  constructor() {

  }

  ngOnInit() {

  }
}
