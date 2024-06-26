import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiversComponent } from './receivers.component';

describe('ReceiverComponent', () => {
  let component: ReceiversComponent;
  let fixture: ComponentFixture<ReceiversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiversComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
