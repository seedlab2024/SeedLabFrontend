import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

// Interfaz para definir la estructura de cada breadcrumb
interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: []
})
export class BreadcrumbsComponent implements OnInit {
  
  public breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // Escucha los eventos de navegación para reconstruir los breadcrumbs en cada cambio de ruta.
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
    });
    
    // Construye los breadcrumbs en la carga inicial de la página.
    this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
  }

  /**
   * Construye el array de breadcrumbs de forma recursiva, recorriendo el árbol de rutas activas.
   * @param route La ruta actual que se está procesando.
   * @param url La URL acumulada hasta este punto de la recursión.
   * @param breadcrumbs El array acumulado de breadcrumbs.
   * @returns Un array de objetos Breadcrumb que representan la ruta de navegación completa.
   */
  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    // Si no hay más hijos, hemos llegado al final del camino y devolvemos lo que hemos construido.
    if (children.length === 0) {
      return breadcrumbs;
    }

    // Iteramos sobre los hijos para encontrar la ruta primaria activada.
    for (const child of children) {
      // Ignoramos outlets con nombre (como 'modal', 'popup', etc.) y nos centramos en el principal.
      if (child.outlet !== 'primary') {
        continue;
      }

      const routeSnapshot = child.snapshot;
      const breadcrumbData = routeSnapshot.data['breadcrumbs'];
      
      // Construimos el segmento de URL de esta ruta hija.
      const routeURL = routeSnapshot.url.map(segment => segment.path).join('/');
      
      // Acumulamos la URL para el siguiente nivel de la recursión.
      // Aseguramos que la URL construida sea correcta.
      const nextUrl = routeURL ? `${url}/${routeURL}` : url;

      // Si la ruta tiene la propiedad 'breadcrumbs' en su data, la agregamos a la lista.
      if (breadcrumbData) {
        for (const label of breadcrumbData) {
          // Comprobamos si la etiqueta ya existe para evitar duplicados.
          if (!breadcrumbs.find(bc => bc.label === label)) {
              breadcrumbs.push({ label: label, url: nextUrl });
          }
        }
      }

      // Hacemos la llamada recursiva para procesar a los "nietos".
      return this.createBreadcrumbs(child, nextUrl, breadcrumbs);
    }
    
    // Devolvemos los breadcrumbs si no se encontró un hijo de outlet primario.
    return breadcrumbs;
  }
}
