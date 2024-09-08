import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../Modelos/user.model';
import { RutaService } from '../../../../servicios/rutas.service';
import { FormBuilder } from '@angular/forms';
import { ActividadService } from '../../../../servicios/actividad.service';
import { Actividad } from '../../../../Modelos/actividad.model';
import { AlertService } from '../../../../servicios/alert.service';

@Component({
  selector: 'app-list-actividades',
  templateUrl: './list-actividades.component.html',
  styleUrl: './list-actividades.component.css',
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
  listAcNiLeCo: [] = [];
  isActive: boolean = true;
  boton = true;
  isLoading: boolean = false;

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
  ) {}
  ngOnInit(): void {
    this.validateToken();
    this.route.queryParams.subscribe((params) => {
      this.rutaId = +params['id_ruta'];
      console.log('id ruta: ', this.rutaId);
    });
    this.ver();
  }
  validateToken(): void {
    if (!this.token) {
      this.token = localStorage.getItem('token');
      let identityJSON = localStorage.getItem('identity');
      //console.log('currentrol',identityJSON);
      if (identityJSON) {
        let identity = JSON.parse(identityJSON);
        this.user = identity;
        this.id = this.user.id;
        this.currentRolId = this.user.id_rol;
        //console.log('ererer',this.id)
        if (this.currentRolId != 1) {
          this.router.navigate(['/home']);
        }
      }
    }
    if (!this.token) {
      this.router.navigate(['/home']);
    }
  }
  ver(): void {
    if (this.rutaId !== null) {
      this.rutaService.actnivleccontXruta(this.token, this.rutaId).subscribe(
        (data) => {
          this.listAcNiLeCo = data;
          console.log('Rutassssss:', this.listAcNiLeCo);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  editarEstado(ActividadId: number): void {
    const estadoActual = this.actividadForm.get('estado')?.value;
    this.alertService.alertaActivarDesactivar("¿Estás seguro de cambiar el estado de la actividad?", 'question').then((result) => {
      if (result.isConfirmed) {
        this.actividadService.estadoActividad(this.token, ActividadId, estadoActual).subscribe(
          (data) => {
            this.alertService.successAlert('Éxito', data.message);
            this.ver();
          },
          (error) => {
            console.error(error);
          }
        );
      }
    });
  }
  toggleActive(ActividadId: number, estadoActual: string): void {
    const nuevoEstado = estadoActual === 'Activo' ? false : true;
    this.actividadForm.patchValue({ estado: nuevoEstado });
    this.editarEstado(ActividadId);
  }

  onEstadoChange(event: any):void{
    this.ver();
  }
  canGoPrevious(): boolean {
    return this.page > 1;
  }
  canGoNext(): boolean {
    const totalItems = this.listAcNiLeCo.length;
    const itemsPerPage = 5;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return this.page < totalPages;
  }
  changePage(page: number | 'previous' | 'next'): void {
    if (page === 'previous' && this.canGoPrevious()) {
      this.page--;
    } else if (page === 'next' && this.canGoNext()) {
      this.page++;
    } else if (typeof page === 'number') {
      this.page = page;
    }
  }
  getPages(): number[] {
    const totalItems = this.listAcNiLeCo.length;
    const itemsPerPage = 5;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  EditarActividad(ActividadId: number): void {
    this.router.navigate(['actnivlec'], { queryParams: { id_actividad: ActividadId } });
  }

  agregarActividadRuta(rutaId: number):void {
    this.router.navigate(['actnivlec'], {
      queryParams: { id_ruta : rutaId},
    });
  }
}
