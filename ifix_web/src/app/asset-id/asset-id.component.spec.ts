import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetIdComponent } from './asset-id.component';

describe('AssetIdComponent', () => {
  let component: AssetIdComponent;
  let fixture: ComponentFixture<AssetIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
