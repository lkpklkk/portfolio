import { TestBed } from '@angular/core/testing';

import { AnimationCorrelatorService } from './animation-correlator.service';

describe('AnimationCorrelatorService', () => {
  let service: AnimationCorrelatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationCorrelatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
