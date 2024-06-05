import { Component, OnInit } from '@angular/core';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { SwitchService } from '../../servicios/switch.service';

@Component({
  selector: 'app-crear-superadmin',
  templateUrl: './crear-superadmin.component.html',
  styleUrl: './crear-superadmin.component.css'
})
export class CrearSuperadminComponent implements OnInit {
  faPen = faPenToSquare;
  faPlus = faPlus;

  modalCrearSuperadmin: boolean;
  isEditing: boolean;

  constructor(private modalCRSA: SwitchService) { }

  ngOnInit(): void {
    this.modalCRSA.$modalCrearSuperadmin.subscribe((valor) => { this.modalCrearSuperadmin = valor })
  }

  openModalCrearSuperAdmin() {
    this.isEditing = false;
    this.modalCrearSuperadmin = true;
  }

  opneModalEditarSuperAdmin() {
    this.isEditing = true;
    this.modalCrearSuperadmin = true;
  }

}
