import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicLabelingRoomComponent } from './dynamic-labeling-room.component';

describe('DsProjectRoomComponent', () => {
  let component: DynamicLabelingRoomComponent;
  let fixture: ComponentFixture<DynamicLabelingRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicLabelingRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLabelingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
