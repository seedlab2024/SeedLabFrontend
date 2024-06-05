import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MenuComponent } from './inicio/menu/menu.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './inicio/body/body.component';
import { AngularMaterialModule } from '../angular-material.module';
import { RegisterComponent } from './auth/register/register.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderComponent } from './header/header.component';
import { EncuestaEmpresaComponent } from './emprendedor/formulario-diagnostico/encuesta-empresa.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { AddEmpresaComponent } from './emprendedor/empresa/add-empresa/add-empresa.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './auth/login/login.component';
import { MatSidenav } from '@angular/material/sidenav';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormsModule, FormGroup } from '@angular/forms';
import { ListEmpresasComponent } from './emprendedor/empresa/list-empresas/list-empresas.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PersonalizacionesComponent } from './super-admin/personalizaciones/personalizaciones.component';
import { AsesoriasComponent } from './asesor/asesorias/asesorias.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ListAliadosComponent } from './super-admin/aliados/list-aliados/list-aliados.component';
import { FanPageComponent } from './aliados/fan-page/fan-page.component';
import { CrearAsesoriaModalComponent } from './emprendedor/asesorias/crear-asesoria-modal/crear-asesoria-modal.component';
import { ListAsesoriaComponent } from './emprendedor/asesorias/list-asesoria/list-asesoria.component';
import { VerAsesoriasComponent } from './orientador/asesorias/list-asesorias/ver-asesorias.component';
import { ModalComponent } from './super-admin/modal/modal.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AddAliadosComponent } from './super-admin/aliados/add-aliados/add-aliados.component';
import { AsesoriaAliadoComponent } from './aliados/asesoria-aliado/asesoria-aliado.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ListRutasComponent } from './super-admin/ruta/list-rutas/list-rutas.component';
import { ReportesComponent } from './orientador/reportes/reportes.component';
import { DarAliadoAsesoriaModalComponent } from './orientador/asesorias/dar-aliado-asesoria-modal/dar-aliado-asesoria-modal.component';
import { DarAsesorModalComponent } from './aliados/asesoria-aliado/dar-asesor-modal/dar-asesor-modal.component';
import { PerfilEmprendedorComponent } from './emprendedor/perfil-emprendedor/perfil-emprendedor.component';
import { EditEmpresaComponent } from './emprendedor/empresa/edit-empresa/edit-empresa.component';
import { RutaEmprendedorComponent } from './emprendedor/ruta-emprendedor/ruta-emprendedor.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RutasComponent } from './rutas/rutas.component';
import { HorarioModalComponent } from './asesor/horario-modal/horario-modal/horario-modal.component';
import { OrientadorCrearComponent } from './orientador/orientador-crear/orientador-crear.component';
import { ModalCrearOrientadorComponent } from './orientador/orientador-crear/modal-crear-orientador/modal-crear-orientador.component';
import { CursorutasComponent } from './cursorutas/cursorutas.component';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafeUrlPipe } from './cursorutas/cursorutas.component';
import { CrearSuperadminComponent } from './super-admin/crear-superadmin/crear-superadmin.component';
import { ModalcrearSuperadminComponent } from './super-admin/modalcrear-superadmin/modalcrear-superadmin.component';





@NgModule({
  declarations: [
    
    AppComponent,
    MenuComponent,
    HeaderComponent,
    EncuestaEmpresaComponent,
    AddEmpresaComponent,
    LoginComponent,
    BodyComponent,
    ListEmpresasComponent,
    AsesoriasComponent,
    ListAliadosComponent,
    FanPageComponent,
    CrearAsesoriaModalComponent,
    ListAsesoriaComponent,
    VerAsesoriasComponent,
    PersonalizacionesComponent,
    ModalComponent,
    AddAliadosComponent,
    SuperAdminComponent,
    ListRutasComponent,
    PerfilEmprendedorComponent,
    ReportesComponent,
    RutaEmprendedorComponent,
    AsesoriaAliadoComponent,
    DarAliadoAsesoriaModalComponent,
    DarAsesorModalComponent,
    EditEmpresaComponent,
    RutasComponent,
    HorarioModalComponent,
    OrientadorCrearComponent,
    ModalCrearOrientadorComponent,
    CursorutasComponent,
    SafeUrlPipe,
    CrearSuperadminComponent,
    ModalcrearSuperadminComponent,
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatIconModule,
    MatSidenav,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FormsModule,
    FilterPipeModule,
    MatDialogModule,
    ColorPickerModule,
    ColorPickerModule,
    SweetAlert2Module.forRoot(),
    BrowserModule,
    ReactiveFormsModule, 
    HttpClientModule
    

  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
// main.ts


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
