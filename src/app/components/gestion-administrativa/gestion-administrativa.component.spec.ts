import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAdministrativaComponent } from './gestion-administrativa.component';

describe('GestionAdministrativaComponent', () => {
  let component: GestionAdministrativaComponent;
  let fixture: ComponentFixture<GestionAdministrativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAdministrativaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAdministrativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
