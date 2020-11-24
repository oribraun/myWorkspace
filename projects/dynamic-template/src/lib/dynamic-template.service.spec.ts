import { TestBed } from '@angular/core/testing';

import { DynamicTemplateService } from './dynamic-template.service';

describe('DynamicTemplateService', () => {
  let service: DynamicTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
