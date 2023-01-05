import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialFileuploadComponent } from './material-fileupload.component';

describe('MaterialFileuploadComponent', () => {
  let component: MaterialFileuploadComponent;
  let fixture: ComponentFixture<MaterialFileuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialFileuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialFileuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
