import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlCreationComponent } from './url-creation.component';

describe('UrlCreationComponent', () => {
  let component: UrlCreationComponent;
  let fixture: ComponentFixture<UrlCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
