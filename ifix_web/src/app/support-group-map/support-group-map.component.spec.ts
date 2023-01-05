import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportGroupMapComponent } from './support-group-map.component';

describe('SupportGroupMapComponent', () => {
  let component: SupportGroupMapComponent;
  let fixture: ComponentFixture<SupportGroupMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportGroupMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportGroupMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
