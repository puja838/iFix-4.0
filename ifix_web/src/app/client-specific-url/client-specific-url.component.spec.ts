import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSpecificUrlComponent } from './client-specific-url.component';

describe('ClientSpecificUrlComponent', () => {
  let component: ClientSpecificUrlComponent;
  let fixture: ComponentFixture<ClientSpecificUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientSpecificUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSpecificUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
