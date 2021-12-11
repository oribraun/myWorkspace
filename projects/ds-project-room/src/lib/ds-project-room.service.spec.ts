import { TestBed } from '@angular/core/testing';

import { DsProjectRoomService } from './ds-project-room.service';

describe('DsProjectRoomService', () => {
  let service: DsProjectRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DsProjectRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
