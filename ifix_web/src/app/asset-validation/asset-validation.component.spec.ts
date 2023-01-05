import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetValidationComponent } from './asset-validation.component';

describe('AssetValidationComponent', () => {
  let component: AssetValidationComponent;
  let fixture: ComponentFixture<AssetValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
