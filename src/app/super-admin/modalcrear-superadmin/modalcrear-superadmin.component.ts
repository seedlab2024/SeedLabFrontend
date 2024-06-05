import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SwitchService } from '../../servicios/switch.service'

@Component({
  selector: 'app-modalcrear-superadmin',
  templateUrl: './modalcrear-superadmin.component.html',
  styleUrl: './modalcrear-superadmin.component.css'
})
export class ModalcrearSuperadminComponent implements OnInit {
  @Input() isEditing: boolean = false
  submitted: boolean = false;


  constructor(private modalCRSA: SwitchService) { }

  ngOnInit(): void { }


  cancelarcrerSuperadmin() {
    this.modalCRSA.$modalCrearSuperadmin.emit(false);
  }

  crearSuperadmin(formularioCrear: NgForm) {
    this.submitted = true;
    
    if (formularioCrear.valid) {
      this.modalCRSA.$modalCrearSuperadmin.emit(false);
    }
  }
}
