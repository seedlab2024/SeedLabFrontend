// list-aliados.component.ts
import { Component, OnInit } from '@angular/core';
import { faEye, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { AliadoService } from '../../servicios/aliado.service';
import { Aliado } from '../../Modelos/aliado.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-aliados',
  providers: [AliadoService],
  templateUrl: './list-aliados.component.html',
  styleUrls: ['./list-aliados.component.css'],
})
export class ListAliadosComponent implements OnInit {
  userFilter: any = { nombre: '', estado_usuario: 'Activo' };
  faeye = faEye;
  falupa = faMagnifyingGlass;
  public page!: number;
  listaAliado: Aliado[] = [];
  token: string | null = null;

  private ESTADO_MAP: { [key: number]: string } = {
    1: 'Activo',
    0: 'Inactivo'
  };

  constructor(
    private aliadoService: AliadoService,
    private router: Router,
    private aRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.validartoken();
    this.cargarAliados(1); // Cargar inicialmente con estado 'Activo'
  }

  validartoken(): void {
    if (typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('token');
      if (!this.token) {
        this.router.navigate(['/inicio/body']);
      }
    }
  }

  cargarAliados(estado: number): void {
    if (this.token) {
      this.aliadoService.getinfoAliado(this.token, estado).subscribe(
        (data: Aliado[]) => {
          this.listaAliado = data.map((item: any) =>
            new Aliado(
              item.id,
              item.nombre,
              item.descripcion,
              item.logo,
              item.ruta_multi,
              item.id_autenticacion,
              item.id_tipo_dato,
              item.email,
              this.ESTADO_MAP[item.estado_usuario] ?? 'Desconocido'
            )
          );
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      console.error('Token is not available');
    }
  }

  onEstadoChange(event: any): void {
    const estado = event.target.value;
    this.cargarAliados(parseInt(estado, 10));
  }

  limpiarFiltro(): void {
    this.userFilter = { nombre: '', estado_usuario: 'Activo' };
    // Opcional: recargar los aliados con el estado por defecto
    this.cargarAliados(1);
  }
}