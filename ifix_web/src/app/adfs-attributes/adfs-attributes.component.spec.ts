import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfsAttributesComponent } from './adfs-attributes.component';

describe('AdfsAttributesComponent', () => {
  let component: AdfsAttributesComponent;
  let fixture: ComponentFixture<AdfsAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdfsAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdfsAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
