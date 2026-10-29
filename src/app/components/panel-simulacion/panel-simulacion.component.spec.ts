import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSimulacionComponent } from './panel-simulacion.component';

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
