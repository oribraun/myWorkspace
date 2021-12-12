import { TestBed } from '@angular/core/testing';

import { DynamicLabelingRoomService } from './dynamic-labeling-room.service';

describe('DsProjectRoomService', () => {
  let service: DynamicLabelingRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicLabelingRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
