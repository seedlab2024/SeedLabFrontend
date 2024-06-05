import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSuperadminComponent } from './crear-superadmin.component';

describe('CrearSuperadminComponent', () => {
  let component: CrearSuperadminComponent;
  let fixture: ComponentFixture<CrearSuperadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearSuperadminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearSuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
