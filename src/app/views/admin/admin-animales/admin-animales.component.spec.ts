import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAnimalesComponent } from './admin-animales.component';

describe('AdminAnimalesComponent', () => {
  let component: AdminAnimalesComponent;
  let fixture: ComponentFixture<AdminAnimalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAnimalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAnimalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
