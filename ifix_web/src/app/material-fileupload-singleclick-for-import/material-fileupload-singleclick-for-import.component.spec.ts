import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialFileuploadSingleclickForImportComponent } from './material-fileupload-singleclick-for-import.component';

describe('MaterialFileuploadSingleclickForImportComponent', () => {
  let component: MaterialFileuploadSingleclickForImportComponent;
  let fixture: ComponentFixture<MaterialFileuploadSingleclickForImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialFileuploadSingleclickForImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialFileuploadSingleclickForImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
