import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Asesoria } from '../../../Modelos/asesoria.model';
import { AsesoriaService } from '../../../servicios/asesoria.service';
import { MatDialog } from '@angular/material/dialog';
import { CrearAsesoriaModalComponent } from '../crear-asesoria-modal/crear-asesoria-modal.component';

@Component({
  selector: 'app-list-asesoria',
  templateUrl: './list-asesoria.component.html',
  styleUrls: ['./list-asesoria.component.css']
})
export class ListAsesoriaComponent implements OnInit {
  asesoriasTrue: Asesoria[] = [];
  asesoriasFalse: Asesoria[] = []; 
  showTrue: boolean = false; // Set to false by default to show "Sin Asignar"
  showFalse: boolean = true; // Set to true by default to show "Sin Asignar"
  token: string | null = null;
  documento: string | null = null;
  user: any = null;
  currentRolId: string | null = null;
  sinAsignarCount: number = 0;
  asignadasCount: number = 0;
  busqueda: string = '';
  asesorias: any[] = []; // Tus datos
  resultadosBusqueda: any[] = []; // 

  constructor(
    private asesoriaService: AsesoriaService, 
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.validateToken();
    this.listarAsesorias();
  }

  validateToken(): void {
    if (!this.token) {
      this.token = localStorage.getItem('token');
      let identityJSON = localStorage.getItem('identity');

      if (identityJSON) {
        let identity = JSON.parse(identityJSON);
        this.user = identity;
        this.documento = this.user.emprendedor.documento;
        this.currentRolId = this.user.id_rol?.toString();
      }
    }

    if (!this.token || !this.documento) {
      this.router.navigate(['/inicio/body']);
    }
  }

  listarAsesorias() {
    if (this.documento && this.token) {
      const bodyTrue = {
        documento: this.documento,
        asignacion: true
      };

      const bodyFalse = {
        documento: this.documento,
        asignacion: false
      };

      this.asesoriaService.getMisAsesorias(bodyTrue).subscribe(
        response => {
          this.asesoriasTrue = response;
          this.asignadasCount = this.asesoriasTrue.length; // Actualiza el contador
        },
        error => {
          console.error(error);
        }
      );

      this.asesoriaService.getMisAsesorias(bodyFalse).subscribe(
        response => {
          this.asesoriasFalse = response;
          this.sinAsignarCount = this.asesoriasFalse.length; // Actualiza el contador
        },
        error => {
          console.error(error);
        }
      );
    } else {
      console.error('Documento o token no encontrado en el localStorage');
    }
  }

  openCrearAsesoriaModal() {
    const dialogRef = this.dialog.open(CrearAsesoriaModalComponent, {
      width: '400px',
      data: {}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Asesoría creada:', result);
        this.listarAsesorias();
      }
    });
  }

  showSinAsignar() {
    this.showTrue = false;
    this.showFalse = true;
  }

  showAsignadas() {
    this.showTrue = true;
    this.showFalse = false;
  }
  manejarCambio(event: Event) {
    this.busqueda = (event.target as HTMLInputElement).value;

    // Lógica de búsqueda
    if (this.busqueda) {
      this.resultadosBusqueda = this.asesorias.filter(asesoria =>
        asesoria.Nombre_sol.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    } else {
      this.resultadosBusqueda = this.asesorias;
    }
  }
  
}
