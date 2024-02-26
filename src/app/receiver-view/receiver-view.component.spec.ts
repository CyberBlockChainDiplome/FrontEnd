import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverViewComponent } from './receiver-view.component';

describe('ReceiverViewComponent', () => {
  let component: ReceiverViewComponent;
  let fixture: ComponentFixture<ReceiverViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiverViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReceiverViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
