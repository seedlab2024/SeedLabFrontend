import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { LoginService } from '../../servicios/login.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Login } from '../../Modelos/login.modelo';
import { User } from '../../Modelos/user.model';
import { AlertService } from '../../servicios/alert.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',

})

export class LoginComponent {
  hide = true;
  reply: Login | null = null;
  token: string | null = null;
  user: User | null = null;
  currentRolId: string | null = null;
  

  loginForm = this.fb.group({
    email: '',
    password: '',
  });

  constructor(
    private loginService: LoginService,
    private router: Router,
    private fb: FormBuilder,
    private alertService: AlertService
  ) { }


  ngOnInit(): void {
    this.validateToken();
}

validateToken(): void {
    if (!this.token) {
        this.token = localStorage.getItem("token");
        let identityJSON = localStorage.getItem('identity');

        if (identityJSON) {
            let identity = JSON.parse(identityJSON);
            console.log(identity);
            this.user = identity;
            this.currentRolId = this.user.id_rol?.toString();
            console.log(this.currentRolId);
        }
    }
    if (!this.token) {
        this.router.navigate(['/login']); 
    } else {
        if (this.currentRolId) {
            switch (this.currentRolId) {
                case '1':
                    this.router.navigate(['list-aliados']);
                    break;
                case '2':
                    this.router.navigate(['/home/body']);
                    break;
                case '3':
                    this.router.navigate(['/home/body']);
                    break;
                case '4':
                    this.router.navigate(['/home/body']);
                    break;
                case '5':
                    this.router.navigate(['list-empresa/', this.user.emprendedor.documento]);
                    break;
                default:
                    this.router.navigate(['/home/body']);
                    break;
            }
        } else {
            console.error('Id de rol no está definido.');
            this.router.navigate(['/home/body']);
        }
    }
}



login(): void {
  const email = this.loginForm.get('email')?.value;
  const password = this.loginForm.get('password')?.value;
  if (!email) {
    this.alertService.errorAlert('Error', "El campo de usuario es requerido");
    return;
  }
  if (!password) {
    this.alertService.errorAlert('Error', "el campo de contraseña es requerido");
    return;
  }
  this.loginService.login(email, password).subscribe(
      (rs: any) => {
          this.reply = rs;
          if (this.reply) {
              localStorage.setItem('token', this.reply.access_token);
              localStorage.setItem('identity', JSON.stringify(this.reply.user));
              localStorage.setItem('currentRolName', this.getRoleName(this.reply.user.id_rol));
              this.token = this.reply.access_token;
              console.log(this.token);
              if (this.reply.user.emprendedor) {
                  localStorage.setItem('documento', this.reply.user.emprendedor.documento);
              }
              this.alertService.successAlert('Exito', 'Inicio de sesión exitoso');
              location.reload();
          }
      },
      err => {
          console.error(err);
          if(err.status === 401) {
            this.alertService.errorAlert('Error', err.error.message);
          } else if(err.status === 422){
            this.alertService.errorAlert('Error', err.error.message);
          } else if(err.status === 403){
            this.alertService.errorAlert('Error', err.error.message);
          }
      }
  );
}

getRoleName(rolId: number | undefined | null): string {
  switch (rolId) {
      case 1:
          return 'Super Administrador';
      case 2:
          return 'Orientador';
      case 3:
          return 'Aliado';
      case 4:
          return 'Asesor';
      default:
          return 'Emprendedor';
  }
}
}