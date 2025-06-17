import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSuperadminComponent } from './pages/list-superadmin/list-superadmin.component';
import { PerfilSuperadminComponent } from './pages/perfil-superadmin/perfil-superadmin.component';
import { PersonalizacionesComponent } from './pages/personalizaciones/personalizaciones.component';
import { ListRutasComponent } from './pages/ruta/list-ruta/list-rutas.component';
import { ListOrientadorComponent } from './pages/orientador/list-orientador/list-orientador.component';
import { ListAliadosComponent } from './pages/aliados/list-aliados/list-aliados.component';
import { AddAliadosComponent } from './pages/aliados/add-aliados/add-aliados.component';
import { ActnivlecComponent } from './pages/ruta/actnivlec/actnivlec.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReportesAdmComponent } from './pages/reportes-adm/reportes-adm.component';
import { ModalCrearOrientadorComponent } from './pages/orientador/add-orientador/modal-crear-orientador.component';
import { ModalCrearSuperadminComponent } from './pages/add-superadmin/modal-crear-superadmin.component';
import { ListActividadesComponent } from './pages/ruta/list-actividades/list-actividades.component';
import { RutaEmprendedorComponent } from '../emprendedor/pages/ruta-emprendedor/ruta-emprendedor.component';
import { CursoRutaEmprendedorComponent } from '../emprendedor/pages/curso-ruta-emprendedor/curso-ruta-emprendedor.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard-superadmin', component: DashboardComponent, data: { title: 'Dashboard', icon: 'fa-solid fa-chart-pie', showInMenu: true, breadcrumbs: ['Dashboard'] } },
      // Aliados
      {
        path: 'aliados',
        data: { breadcrumbs: ['Aliados'] },
        children: [
          { path: '', component: ListAliadosComponent, data: { title: 'Aliados', icon: 'fa-solid fa-users-line', showInMenu: true } },
          { path: 'add-aliados', component: AddAliadosComponent, data: { showInMenu: false, breadcrumbs: ['Agregar Aliado'] } },
          { path: 'edit-aliados/:id', component: AddAliadosComponent, data: { showInMenu: false, breadcrumbs: ['Editar Aliado'] } },

        ]
      },
      // Orientador
      {
        path: 'orientador',
        data: { breadcrumbs: ['Orientador'] },
        children: [
          { path: '', component: ListOrientadorComponent, data: { title: 'Orientador', icon: 'fa-solid fa-chalkboard-user', showInMenu: true } },
          { path: 'add-orientador', component: ModalCrearOrientadorComponent, data: { showInMenu: false, breadcrumbs:['Agregar Orientador'] } },
          { path: 'edit-orientador/:id', component: ModalCrearOrientadorComponent, data: { showInMenu: false, breadcrumbs:['Editar Orientador'] } },
        ]
      },

      // Superadmin
      {
        path: 'superadmin',
        data: { breadcrumbs: ['Superadmin'] },
        children: [
          { path: '', component: ListSuperadminComponent, data: { title: 'Super Admin', icon: 'fa-solid fa-user', showInMenu: true } },
          { path: 'add-superAdmin', component: ModalCrearSuperadminComponent, data: { showInMenu: false, breadcrumbs:['Agregar Superadmin'] } },
          { path: 'edit-superAdmin/:id', component: ModalCrearSuperadminComponent, data: { showInMenu: false, breadcrumbs:['Editar Superadmin'] } },
          { path: 'curso-ruta-superadmin', component: CursoRutaEmprendedorComponent, data: { showInMenu: false } },
          { path: 'ruta', component: RutaEmprendedorComponent, data: { title: 'Ruta General', showInMenu: true, icon: 'fa-solid fa-code-fork', breadcrumbs: ['Ruta General'] } },
        ]
      },
      
      { path: 'reportes-admin', component: ReportesAdmComponent, data: { title: 'Reportes-Admin', icon: 'fa-regular fa-file-lines', showInMenu: true, breadcrumbs: ['Reportes'] } },
      
      // Rutas
      {
        path: 'rutas',
        data: { breadcrumbs: ['Rutas'] },
        children: [
          { path: '', component: ListRutasComponent, data: { title: 'Rutas', icon: 'fa-solid fa-location-arrow', showInMenu: true } },
          { path: 'actnivlec', component: ActnivlecComponent, data: { title: 'Act-Niv-Lec', showInMenu: false, breadcrumbs:['Actividades - Niveles - Lección'] } },
          { path: 'list-actividades', component: ListActividadesComponent, data: { title: 'Actividades', showInMenu: false, breadcrumbs:['Listar Actividades'] } },
        ]
      },


      { path: 'personalizaciones', component: PersonalizacionesComponent, data: { title: 'Personalización', icon: 'fa-solid fa-paintbrush', showInMenu: true, breadcrumbs: ['Personalización'] } },
      { path: 'perfil-admin', component: PerfilSuperadminComponent, data: { title: 'Perfil', icon: 'fa-solid fa-circle-user', showInMenu: true, breadcrumbs: ['Perfil'] } },
    ]
  }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SuperadminRoutingModule {
  static getRoutes(): Routes {
    return routes;
  }
}
