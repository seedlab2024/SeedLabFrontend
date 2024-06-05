import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcrearSuperadminComponent } from './modalcrear-superadmin.component';

describe('ModalcrearSuperadminComponent', () => {
  let component: ModalcrearSuperadminComponent;
  let fixture: ComponentFixture<ModalcrearSuperadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalcrearSuperadminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalcrearSuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
