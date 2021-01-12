import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTemplateComponent } from './dynamic-template.component';
import { DynamicComponentDirective } from './dynamic-component.directive';

describe('DynamicTemplateComponent', () => {
  let component: DynamicTemplateComponent;
  let fixture: ComponentFixture<DynamicTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [ DynamicTemplateComponent, DynamicComponentDirective ],
      providers: [DynamicComponentDirective],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTemplateComponent);
    component = fixture.componentInstance;
    // TestBed.inject(DynamicComponentDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // component.settings = {
    //   firstComponent: component,
    //   secondComponent: component,
    //   thirdComponent: component,
    // };
    expect(component).toBeTruthy();
  });
});
