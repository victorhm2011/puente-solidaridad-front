import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPhysicianComponent } from './new-physician.component';

describe('NewPhysicianComponent', () => {
  let component: NewPhysicianComponent;
  let fixture: ComponentFixture<NewPhysicianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPhysicianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPhysicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
