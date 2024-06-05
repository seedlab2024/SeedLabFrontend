import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-asesoria-modal',
  templateUrl: './crear-asesoria-modal.component.html',
  styleUrls: ['./crear-asesoria-modal.component.css']
})
export class CrearAsesoriaModalComponent {
  asesoriaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearAsesoriaModalComponent>
  ) {
    this.asesoriaForm = this.fb.group({
      titulo: [''],
      descripcion: [''],
      // Agrega más controles según sea necesario
    });
  }

  onSubmit() {
    if (this.asesoriaForm.valid) {
      // Lógica para guardar la asesoría
      this.dialogRef.close(this.asesoriaForm.value);
    }
  }
}
