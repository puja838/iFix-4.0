import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleClientComponent } from './module-client.component';

describe('ModuleClientComponent', () => {
  let component: ModuleClientComponent;
  let fixture: ComponentFixture<ModuleClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
