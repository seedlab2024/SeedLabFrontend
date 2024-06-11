import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AsesorService } from '../../servicios/asesor.service';

import { Asesor } from '../../Modelos/asesor.model';
import { User } from '../../Modelos/user.model';

@Component({
  selector: 'app-perfil-asesor',
  templateUrl: './perfil-asesor.component.html',
  styleUrl: './perfil-asesor.component.css',
  providers: [AsesorService]
})
export class PerfilAsesorComponent implements OnInit {
  token: string | null = null;
  blockedInputs = true;
  id: number | null = null;
  nombre: string | null = null;
  currentRolId: string | null = null;
  user: User
  boton: boolean;
  hide = true;
  bloqueado = true;

  asesorForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    celular: ['', [Validators.required, Validators.maxLength(10)]],
    aliado: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    estado: '1',
  });

  constructor(private fb: FormBuilder,
    private asesorService: AsesorService) { }

  ngOnInit(): void {
    this.validateToken();
    this.verEditar();
  }

  validateToken(): void {
    if (!this.token) {
      this.token = localStorage.getItem('token');
      //console.log(this.token);
      let identityJSON = localStorage.getItem('identity');

      if (identityJSON) {
        let identity = JSON.parse(identityJSON);
        //console.log(identity);
        this.user = identity;
        this.currentRolId = this.user.id_rol?.toString();
        this.id = this.user.id;
        console.log("this", identity);
      }
    }
  }

  verEditar(): void {
    this.asesorService.getAsesorID(this.token, this.id).subscribe(
      data => {
        this.asesorForm.patchValue({
          nombre: data.nombre,
          apellido: data.apellido,
          celular: data.celular,
          email: data.auth?.email,
        });
      },
      error => {
        console.log(error);
      }
    )
  }

  editAsesor(): void {
    const asesor: Asesor = {
      nombre: this.asesorForm.get('nombre')?.value,
      apellido: this.asesorForm.get('apellido')?.value,
      celular: this.asesorForm.get('celular')?.value,
      aliado: this.asesorForm.get('aliado')?.value,
      email: this.asesorForm.get('email')?.value,
      password: this.asesorForm.get('password')?.value,
      estado: this.asesorForm.get('estado')?.value,
    };
    this.asesorService.updateAsesor(this.token, this.id, asesor).subscribe(
      data => {
        //console.log("SIUUUUUU", data);
        location.reload();
      },
      error => {
        console.error(error);
      }
    )
  }

  toggleInputsLock(): void {
    this.blockedInputs = !this.blockedInputs;
    const fieldsToToggle = ['nombre', 'apellido', 'celular'];
    fieldsToToggle.forEach(field => {
      const control = this.asesorForm.get(field);
        if (this.blockedInputs) {
          control.disable();
        } else {
          control.enable();
        }
    });
  }

  onCancel(): void {
    this.verEditar();
  }

  mostrarGuardarCambios(): void {
    this.boton = false;
  }
}
