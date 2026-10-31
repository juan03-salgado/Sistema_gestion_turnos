import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSimulacionComponent } from './gestion-atencion.component';

describe('PanelSimulacionComponent', () => {
  let component: PanelSimulacionComponent;
  let fixture: ComponentFixture<PanelSimulacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelSimulacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelSimulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
