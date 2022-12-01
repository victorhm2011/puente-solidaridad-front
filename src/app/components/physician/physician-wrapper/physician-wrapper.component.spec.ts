import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianWrapperComponent } from './physician-wrapper.component';

describe('PhysicianWrapperComponent', () => {
  let component: PhysicianWrapperComponent;
  let fixture: ComponentFixture<PhysicianWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicianWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicianWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
