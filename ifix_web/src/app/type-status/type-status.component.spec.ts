import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeStatusComponent } from './type-status.component';

describe('TypeStatusComponent', () => {
  let component: TypeStatusComponent;
  let fixture: ComponentFixture<TypeStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
