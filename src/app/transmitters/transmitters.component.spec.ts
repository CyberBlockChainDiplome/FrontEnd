import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmitterComponent } from './transmitter.component';

describe('TransmitterComponent', () => {
  let component: TransmitterComponent;
  let fixture: ComponentFixture<TransmitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransmitterComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
