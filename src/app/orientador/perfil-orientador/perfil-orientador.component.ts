import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertService } from '../../servicios/alert.service';
import { OrientadorService } from '../../servicios/orientador.service';

import { Orientador } from '../../Modelos/orientador.model';
import { User } from '../../Modelos/user.model';

@Component({
  selector: 'app-perfil-orientador',
  templateUrl: './perfil-orientador.component.html',
  styleUrl: './perfil-orientador.component.css'
})
export class PerfilOrientadorComponent {

  user: User | null = null;
  token = '';
  currentRolId: string | null = null;
  id: number;
  blockedInputs = true;
  boton: boolean 


  perfilorientadorForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    celular: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(10), this.passwordValidator]],
    estado: [true],
  });

  constructor(
    private orientadorService: OrientadorService,
    private router: Router,
    private fb: FormBuilder,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.validateToken();
    this.verEditar();
  }

  validateToken(): void {
    if (!this.token) {
      this.token = localStorage.getItem("token");
      let identityJSON = localStorage.getItem('identity');

      if (identityJSON) {
        let identity = JSON.parse(identityJSON);
        //console.log(identity);
        this.user = identity;
        this.id = this.user.id;
        this.currentRolId = this.user.id_rol?.toString();
        //console.log(this.currentRolId);
      }
    }
  }

  verEditar(): void {
    if (this.token) {
      this.orientadorService.getinformacionOrientador(this.token, this.id).subscribe(
        (data) => {
          this.perfilorientadorForm.patchValue({
            nombre: data.nombre,
            apellido: data.apellido,
            celular: data.celular,
            email: data.auth.email,
            password: data.auth.password,
          });
          console.log(data);
        },
        (err) => {
          console.log(err);
        }
      )
    }
  }

  updateOrientador(): void {
    const perfil: Orientador={
      nombre: this.perfilorientadorForm.get('nombre')?.value,
      apellido: this.perfilorientadorForm.get('apellido')?.value,
      celular: this.perfilorientadorForm.get('celular')?.value,
      email: this.perfilorientadorForm.get('email')?.value,
      password:this.perfilorientadorForm.get('password')?.value,
      estado: true,
    }
    this.orientadorService.updateOrientador(this.token, this.id, perfil).subscribe(
      (data)=>{
        location.reload();
      },
      (err)=>{
        console.log(err);
      }
    )
  }


  passwordValidator(control: AbstractControl) {
    const value = control.value;
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

    if (hasUpperCase && hasSpecialChar) {
      return null;
    } else {
      return { passwordStrength: 'La contraseña debe contener al menos una letra mayúscula y un carácter especial *' };
    }
  }

  toggleInputsLock():void{
    this.blockedInputs =!this.blockedInputs;
    const fieldsToToggle = ['nombre','apellido','celular','email','email','password'];
    fieldsToToggle.forEach(field =>{
      const control = this.perfilorientadorForm.get(field);
      if (this.blockedInputs) {
        control.disable();
      }else{
        control.enable();
      }
    })
  }

  // Restaura los datos originales
  onCancel(): void {
    this.verEditar();
  }

  mostrarGuardarCambios(): void {
    this.boton = false;
  }

}
