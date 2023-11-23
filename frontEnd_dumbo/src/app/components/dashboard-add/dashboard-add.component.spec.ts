import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAddComponent } from './dashboard-add.component';

describe('DashboardAddComponent', () => {
  let component: DashboardAddComponent;
  let fixture: ComponentFixture<DashboardAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardAddComponent]
    });
    fixture = TestBed.createComponent(DashboardAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
