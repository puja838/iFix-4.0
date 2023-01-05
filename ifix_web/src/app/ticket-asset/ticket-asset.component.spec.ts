import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketAssetComponent } from './ticket-asset.component';

describe('TicketAssetComponent', () => {
  let component: TicketAssetComponent;
  let fixture: ComponentFixture<TicketAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
