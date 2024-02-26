import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmitterViewComponent } from './transmitter-view.component';

describe('TransmitterViewComponent', () => {
  let component: TransmitterViewComponent;
  let fixture: ComponentFixture<TransmitterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransmitterViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransmitterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
