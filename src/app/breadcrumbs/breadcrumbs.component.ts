// breadcrumbs.ts (Versión modificada y dinámica)

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, PRIMARY_OUTLET } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User } from '../Modelos/user.model';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: []
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  public breadcrumbs: Breadcrumb[] = [];
  private routerSubscription: Subscription;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.routerSubscription = new Subscription();
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.buildBreadcrumbs(); // Llamamos a nuestra nueva función principal
    });
    // Carga inicial
    this.buildBreadcrumbs();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  /**
   * Construye la lista completa de breadcrumbs, comenzando con el "Inicio" dinámico.
   */
  private buildBreadcrumbs(): void {
    // 1. Crear el breadcrumb de "Inicio" con la URL del dashboard del rol.
    const homeBreadcrumb: Breadcrumb = {
      label: 'Inicio',
      url: this.getDashboardUrlForCurrentUser()
    };

    // 2. Obtener los breadcrumbs de la ruta activa.
    const routeBreadcrumbs = this.createBreadcrumbsFromRoute(this.activatedRoute.root);

    // 3. Combinarlos en el array final.
    this.breadcrumbs = [homeBreadcrumb, ...routeBreadcrumbs];
  }

  /**
   * Obtiene la URL del dashboard basada en el rol del usuario guardado en localStorage.
   * Esta es la misma lógica de tu LoginComponent.
   */
  private getDashboardUrlForCurrentUser(): string {
    const identityJSON = localStorage.getItem('identity');
    if (!identityJSON) {
      return '/home'; // URL por defecto si no hay usuario logueado
    }

    const user: User = JSON.parse(identityJSON);
    const currentRolId = user.id_rol?.toString();

    switch (currentRolId) {
      case '1': return '/superadmin/dashboard-superadmin';
      case '2': return '/orientador/dashboard-orientador';
      case '3': return '/aliados/dashboard-aliado';
      case '4': return '/asesor/asesorias';
      case '5': return '/emprendedor/empresa';
      default: return '/home'; // Fallback por si el rol no se reconoce
    }
  }

  /**
   * Crea los breadcrumbs basándose en la configuración de la ruta (excluyendo "Inicio").
   * He renombrado tu `createBreadcrumbs` para mayor claridad.
   */
  private createBreadcrumbsFromRoute(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      const routeSnapshot = child.snapshot;
      const nextUrlSegments = (url ? url.split('/') : []).concat(routeSnapshot.url.map(s => s.path));
      const nextUrl = nextUrlSegments.filter(Boolean).join('/');

      if (routeSnapshot.data['breadcrumbs']) {
        const breadcrumbData = routeSnapshot.data['breadcrumbs'];
        for (const label of breadcrumbData) {
          const finalUrl = `/${nextUrl}`;
          // Evitamos añadir duplicados
          if (!breadcrumbs.some(b => b.label === label && b.url === finalUrl)) {
            breadcrumbs.push({ label, url: finalUrl });
          }
        }
      }

      return this.createBreadcrumbsFromRoute(child, nextUrl, breadcrumbs);
    }
    return breadcrumbs;
  }
}