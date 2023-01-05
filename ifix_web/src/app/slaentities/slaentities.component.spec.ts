import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaentitiesComponent } from './slaentities.component';

describe('SlaentitiesComponent', () => {
  let component: SlaentitiesComponent;
  let fixture: ComponentFixture<SlaentitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaentitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaentitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
