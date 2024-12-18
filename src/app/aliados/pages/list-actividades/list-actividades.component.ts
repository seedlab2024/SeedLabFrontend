import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../Modelos/user.model';
import { RutaService } from '../../../servicios/rutas.service';
import { FormBuilder } from '@angular/forms';
import { ActividadService } from '../../../servicios/actividad.service';
import { AlertService } from '../../../servicios/alert.service';

@Component({
  selector: 'app-list-actividades',
  templateUrl: './list-actividades.component.html',
  styleUrl: './list-actividades.component.css'
})
export class ListActividadesComponent {
  userFilter: any = { nombre: '', estado: 'Activo', };
  public page: number = 1;
  token: string | null = null;
  rutaId: number | null = null;
  ActividadId: any;
  user: User | null = null;
  id: number | null = null;
  currentRolId: number;
  listAcNiLeCo: any[] = [];
  isActive: boolean = true;
  boton = true;
  isLoading: boolean = false;
  idAliado: any;
  todasLasActividades: any[] = [];
  actividadForm = this.fb.group({
    estado: [true],
  })

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private rutaService: RutaService,
    private actividadService: ActividadService,
    private alertService: AlertService,
  ) { }

  /* Inicializa con esas funciones al cargar la pagina */
  ngOnInit(): void {
    this.validateToken();
    this.route.queryParams.subscribe((params) => {
      this.rutaId = +params['id_ruta'];
    });
    this.ver();
  }

  /*
    Este método asegura que el token y la identidad del usuario estén disponibles para su uso en el 
    formulario o cualquier otra parte de la aplicación.
  */
  validateToken(): void {
    if (!this.token) {
      this.token = localStorage.getItem('token');
      let identityJSON = localStorage.getItem('identity');

      if (identityJSON) {
        let identity = JSON.parse(identityJSON);
        this.user = identity;
        this.idAliado = this.user.id;
        this.currentRolId = this.user.id_rol;
        if (this.currentRolId != 3) {
          this.router.navigate(['home']);
        }
      }
    }
    if (!this.token) {
      this.router.navigate(['home']);
    }
  }

  /*
    Este método se utiliza para activar una ruta asociada a un aliado 
    y cargar las actividades relacionadas con esa ruta en la interfaz de usuario.
  */
  ver(): void {
    this.isLoading = true;
    this.isActive = true;
    if (this.rutaId !== null) {
      this.rutaService.activadadxAliado(this.token, this.rutaId, this.idAliado, this.userFilter.estado).subscribe(
        (data) => {
          this.listAcNiLeCo = [data];
          this.todasLasActividades = this.listAcNiLeCo.flatMap(ruta => (ruta as any).actividades || []);
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      );
    }
  }

  /*
    Este método permite cambiar el estado de una actividad 
    específica mediante una alerta de confirmación. Si el usuario 
    confirma la acción, se realiza una solicitud para actualizar 
    el estado de la actividad en el servidor.
  */

  editarEstado(ActividadId: number): void {
    const estadoActual = this.actividadForm.get('estado')?.value;
    this.alertService.alertaActivarDesactivar("¿Estás seguro de cambiar el estado de la actividad?", 'question').then((result) => {
      if (result.isConfirmed) {
        this.actividadService.estadoActividad(this.token, ActividadId, estadoActual).subscribe(
          (data) => {
            this.alertService.successAlert('Éxito', data.message);
            location.reload();
          },
          (error) => {
            console.error(error);
          }
        );
      }
    });
  }

  /*
     Este método es útil para gestionar la activación/desactivación de una actividad en la interfaz de usuario.
  */
  toggleActive(ActividadId: number, estadoActual: string): void {
    const nuevoEstado = estadoActual === 'Activo' ? false : true;
    this.actividadForm.patchValue({ estado: nuevoEstado });
    this.editarEstado(ActividadId);
  }

  /*
    Este método se encarga de manejar los cambios en 
    el estado de una actividad.
  */
  onEstadoChange(event: any): void {
    this.ver();
  }

  /*
    Este método verifica si es posible retroceder a 
    la página anterior en el sistema de paginación.
  */
  canGoPrevious(): boolean {
    return this.page > 1;
  }

  /*
    Este método verifica si es posible avanzar a 
    la siguiente página en el sistema de paginación.
  */
  canGoNext(): boolean {
    const totalItems = this.todasLasActividades.length;
    const itemsPerPage = 5;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return this.page < totalPages;
  }

  /*
    Este método permite cambiar la página actual 
    en el sistema de paginación. Acepta un argumento que 
    determina la nueva página a la que se debe navegar.
  */
  changePage(page: number | 'previous' | 'next'): void {
    if (page === 'previous' && this.canGoPrevious()) {
      this.page--;
    } else if (page === 'next' && this.canGoNext()) {
      this.page++;
    } else if (typeof page === 'number') {
      this.page = page;
    }
  }

  /*
    Este método genera un array de números que 
    representan las páginas disponibles en el sistema de 
    paginación, basado en la cantidad total de elementos 
    y la cantidad de elementos por página.
  */
  getPages(): number[] {
    const totalItems = this.todasLasActividades.length;
    const itemsPerPage = 5;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  /*
    Este método maneja la lógica para editar 
    una actividad específica basándose en su estado actual.
  */
  EditarActividad(ActividadId: number, rutaId: number, isEditing: boolean, estado: any): void {
    if (estado === 'Inactivo') {
      this.alertService.alertainformativa('No puedes editar actividades cuando la actividad este inactiva, debes activarla para poderla editar', 'error').then((result) => {
        if (result.isConfirmed) {
        }
      });
    } else {
      this.router.navigate(['Ruta'], { queryParams: { id_actividad: ActividadId, id_ruta: rutaId, isEditing: isEditing } });
    }
  }

  /*
    Este método permite a los usuarios 
    agregar nuevas actividades a una ruta específica de manera.
  */
  agregarActividadRuta(rutaId: number): void {
    this.router.navigate(['Ruta'], {
      queryParams: { id_ruta: rutaId },
    });
  }
}
