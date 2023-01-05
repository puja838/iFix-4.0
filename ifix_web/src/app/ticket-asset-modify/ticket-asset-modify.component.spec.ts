import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketAssetModifyComponent } from './ticket-asset-modify.component';

describe('TicketAssetModifyComponent', () => {
  let component: TicketAssetModifyComponent;
  let fixture: ComponentFixture<TicketAssetModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketAssetModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketAssetModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
