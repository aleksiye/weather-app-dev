import { TestBed } from '@angular/core/testing';

import { Current } from './current';

describe('Current', () => {
  let service: Current;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Current);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
