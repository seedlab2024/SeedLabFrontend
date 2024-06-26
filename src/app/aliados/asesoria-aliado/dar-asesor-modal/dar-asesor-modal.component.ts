import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsesoriaService } from '../../../servicios/asesoria.service';
import { AsesorDisponible } from '../../../Modelos/AsesorDisponible.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dar-asesor-modal',
  templateUrl: './dar-asesor-modal.component.html',
  styleUrls: ['./dar-asesor-modal.component.css'],
  providers: [AsesoriaService]
})
export class DarAsesorModalComponent implements OnInit {
  asignarForm: FormGroup;
  asesores: AsesorDisponible[] = [];
  token: string | null = null;
  user: any = null;
  currentRolId: string | null = null;
  @Output() asesoriaAsignada = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<DarAsesorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private asesoriaService: AsesoriaService,
  ) {
    this.asignarForm = this.fb.group({
      nom_asesor: ['', Validators.required]
    });
  }

  /* Inicializa con esas funciones al cargar la pagina */
  ngOnInit() {
    this.validateToken();
    const identityJSON = localStorage.getItem('identity');
    if (identityJSON) {
      const identity = JSON.parse(identityJSON);
      const idAliado = identity.id;
      this.cargarAsesores(idAliado);
    }
  }
  
  /* Valida el token del login */
  validateToken(): void {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    if (!this.token ) {
      this.router.navigate(['/inicio/body']);
  }
}

  onGuardar(): void {
    if (this.asignarForm.valid) {
      const idAsesor = this.asignarForm.get('nom_asesor')?.value;
      const idAsesoria = this.data.asesoria.id_asesoria;

      this.asesoriaService.asignarAsesoria(this.token, idAsesoria, idAsesor).subscribe(
        response => {
          this.asesoriaAsignada.emit(); // Emit the event
          this.dialogRef.close(true);
        },
        error => {
          console.error('Error al asignar asesoría:', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  cargarAsesores(idaliado: number): void {
    this.asesoriaService.listarAsesores(this.token, idaliado).subscribe(
      data => {
        this.asesores = data;
      },
      error => {
        console.error('Error al obtener los asesores disponibles:', error);
      }
    );
  }
}
