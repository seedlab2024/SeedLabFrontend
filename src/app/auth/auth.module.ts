import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule} from '@angular/forms';


import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { VerificationComponent } from './pages/verification/verification.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { PoliticaPrivacidadComponent } from './pages/politica-privacidad/politica-privacidad.component';
import { SharedModule } from '../shared.module';



@NgModule({
  declarations: [
    LoginComponent,
    ForgotComponent,
    VerificationComponent,
    NotFoundComponent,
    PoliticaPrivacidadComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    RegistroComponent,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ]
})
export class AuthModule { }
