import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPhysicianComponent } from './show-physician.component';

describe('ShowPhysicianComponent', () => {
  let component: ShowPhysicianComponent;
  let fixture: ComponentFixture<ShowPhysicianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPhysicianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPhysicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
