// import { Injectable } from '@angular/core';
// import { SuperadminRoutingModule } from '../superadmin/superadmin-routing.module';
// import { OrientadorRoutingModule } from '../orientador/orientador-routing.module';
// import { AliadosRoutingModule } from '../aliados/aliados-routing.module';
// import { AsesorRoutingModule } from '../asesor/asesor-routing.module';
// import { EmprendedorRoutingModule } from '../emprendedor/emprendedor-routing.module';
// import { Route, Routes } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class MenuService {

//   /* Mapeo de roles a sus respectivas rutas */
//   private roleRoutes = {
//     SuperAdministrador: SuperadminRoutingModule.getRoutes(),
//     Orientador: OrientadorRoutingModule.getRoutes(),
//     Aliado: AliadosRoutingModule.getRoutes(),
//     Asesor: AsesorRoutingModule.getRoutes(),
//     Emprendedor: EmprendedorRoutingModule.getRoutes()
//   }

//   constructor() { }

//   /* Obtiene las rutas del menú para un rol específico */
//   getRoutesByRole(role: string): any[] {
//     const routes = this.roleRoutes[role] || [];
//     return this.flattenRoutes(routes).filter(route => route.data?.showInMenu).map(route => ({
//       name: route.data?.title,
//       route: `/${route.path}`,
//       icon: route.data?.icon,
//     }));
//   }

//   /* Aplana la estructura de rutas anidadas */
//   private flattenRoutes(routes: Routes): Route[] {
//     const flatRoutes: Route[] = [];
//     routes.forEach(route => {
//       if (route.children) {
//         flatRoutes.push(...this.flattenRoutes(route.children));
//       } else {
//         flatRoutes.push(route);
//       }
//     });
//     return flatRoutes;
//   }
// }
// En menu.service.ts

import { Injectable } from '@angular/core';
import { SuperadminRoutingModule } from '../superadmin/superadmin-routing.module';
import { OrientadorRoutingModule } from '../orientador/orientador-routing.module';
import { AliadosRoutingModule } from '../aliados/aliados-routing.module';
import { AsesorRoutingModule } from '../asesor/asesor-routing.module';
import { EmprendedorRoutingModule } from '../emprendedor/emprendedor-routing.module';
import { Route, Routes } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  /* Mapeo de roles a sus respectivas rutas */
  private roleRoutes = {
    'SuperAdministrador': {
      routes: SuperadminRoutingModule.getRoutes(),
      basePath: 'superadmin'
    },
    'Orientador': {
      routes: OrientadorRoutingModule.getRoutes(),
      basePath: 'orientador'
    },
    'Aliado': {
      routes: AliadosRoutingModule.getRoutes(),
      basePath: 'aliados'
    },
    'Asesor': {
      routes: AsesorRoutingModule.getRoutes(),
      basePath: 'asesor'
    },
    'Emprendedor': {
      routes: EmprendedorRoutingModule.getRoutes(),
      basePath: 'emprendedor'
    }
  };

  constructor() { }

  /* Obtiene las rutas del menú para un rol específico */
  getRoutesByRole(role: string | null): any[] {
    if (!role) {
      return [];
    }

    // CAMBIO: Asegúrate de que 'role' no sea null y exista en roleRoutes.
    const roleConfig = this.roleRoutes[role as keyof typeof this.roleRoutes];
    if (!roleConfig) {
      return [];
    }

    // Llamamos a la nueva función de aplanamiento, empezando con un path base vacío.
    const flatRoutes = this.flattenRoutes(roleConfig.routes, `/${roleConfig.basePath}`);

    return flatRoutes
      .filter(route => route.data?.showInMenu)
      .map(route => ({
        name: route.data?.title,
        // 'route.path' ahora contendrá la ruta completa, ej: '/superadmin/aliados'
        route: route.path,
        icon: route.data?.icon,
      }));
  }

  private flattenRoutes(routes: Routes, basePath: string): Route[] {
    const flatRoutes: Route[] = [];

    routes.forEach(route => {
      // Ignora rutas sin un path definido para evitar errores.
      if (route.path === undefined) return;

      // Construye la ruta completa para este nivel.
      // Se une el path base con el path actual, evitando dobles slashes.
      const fullPath = [basePath, route.path].join('/').replace(/\/\//g, '/');

      // Creamos una NUEVA ruta para no modificar el objeto original.
      // Le asignamos el path completo que acabamos de construir.
      const newRoute: Route = { ...route, path: fullPath };

      if (route.children) {
        // Si hay hijos, llamamos recursivamente pasando el 'fullPath' como nuevo 'basePath'.
        // Añadimos la ruta actual solo si tiene un componente (es una ruta "renderizable").
        if (route.component) {
          flatRoutes.push(newRoute);
        }
        flatRoutes.push(...this.flattenRoutes(route.children, fullPath));
      } else {
        // Si no tiene hijos, es una ruta final. La añadimos a la lista.
        flatRoutes.push(newRoute);
      }
    });

    return flatRoutes;
  }
}