import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaTurnosComponent } from './pantalla-turnos.component';

describe('PantallaTurnosComponent', () => {
  let component: PantallaTurnosComponent;
  let fixture: ComponentFixture<PantallaTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantallaTurnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
