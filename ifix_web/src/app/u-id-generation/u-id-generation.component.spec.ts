import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UIdGenerationComponent } from './u-id-generation.component';

describe('UIdGenerationComponent', () => {
  let component: UIdGenerationComponent;
  let fixture: ComponentFixture<UIdGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UIdGenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UIdGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
