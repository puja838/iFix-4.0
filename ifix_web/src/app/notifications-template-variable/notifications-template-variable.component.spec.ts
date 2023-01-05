import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsTemplateVariableComponent } from './notifications-template-variable.component';

describe('NotificationsTemplateVariableComponent', () => {
  let component: NotificationsTemplateVariableComponent;
  let fixture: ComponentFixture<NotificationsTemplateVariableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsTemplateVariableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsTemplateVariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
