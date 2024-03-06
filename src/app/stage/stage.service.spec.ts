import { TestBed } from '@angular/core/testing';

import { GradeService } from './grades.service';

describe('StudentService', () => {
  let service: GradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
