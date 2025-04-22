import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVisitasComponent } from './admin-visitas.component';

describe('AdminVisitasComponent', () => {
  let component: AdminVisitasComponent;
  let fixture: ComponentFixture<AdminVisitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminVisitasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminVisitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
