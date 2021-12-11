import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsProjectRoomComponent } from './ds-project-room.component';

describe('DsProjectRoomComponent', () => {
  let component: DsProjectRoomComponent;
  let fixture: ComponentFixture<DsProjectRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsProjectRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsProjectRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
