import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { User } from '../../../../Modelos/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AliadoService } from '../../../../servicios/aliado.service';
import { AlertService } from '../../../../servicios/alert.service';
import { Console } from 'console';

@Component({
  selector: 'app-add-banner-modal',
  templateUrl: './add-banner-modal.component.html',
  styleUrl: './add-banner-modal.component.css'
})


export class AddBannerModalComponent {
  currentRolId: number;
  user: User | null = null;
  token: string;
  id: number | null = null;
  id_banner: number | null = null;
  bannerForm: FormGroup;
  selectedBanner: File | null = null;
  idAliado: string;
  bannerPreview: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddBannerModalComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private aliadoService: AliadoService,
    private alertService: AlertService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.id_banner = data.id;
    this.idAliado = data.idAliado;
    console.log("ALIADO", this.idAliado);
    console.log("IDDD", this.id_banner);

    this.bannerForm = this.formBuilder.group({
      urlImagen: [null, Validators.required],
      estadobanner: ['Activo'],
    });

  }


  validateToken(): void {
    if (!this.token) {
      this.token = localStorage.getItem('token');
      let identityJSON = localStorage.getItem('identity');

      if (identityJSON) {
        let identity = JSON.parse(identityJSON);
        this.user = identity;
        this.id = this.user.id;
        this.currentRolId = this.user.id_rol;
        console.log("OTRO ID",this.currentRolId);
        if (this.currentRolId != 1) {
          this.router.navigate(['home']);
        }
      }
    }
    if (!this.token) {
      this.router.navigate(['home']);
    }
  }

  ngOnInit(): void{
    this.validateToken();
console.log("PARA EL TOKEN",this.currentRolId)
  }

  addBanner(): void {

    const formData = new FormData();
    let aliado_modal = this.idAliado;


    if (this.selectedBanner) {
      formData.append('banner_urlImagen', this.selectedBanner, this.selectedBanner.name);
    }

    formData.append('banner_estadobanner', this.bannerForm.get('estadobanner')?.value);
    formData.append('id_aliado', aliado_modal);
    console.log("forma", );
    if (this.id_banner != null) {
      this.aliadoService.editarBanner(this.token, this.id_banner, formData).subscribe(
        data => {
          console.log("ACTUALIZAAA", data);
          //this.dialogRef.close();
          //location.reload();
        }
      ),
        error => {
          console.error(error);
        }

    } else {
      this.aliadoService.crearBanner(this.token, formData).subscribe(
        data => {
          console.log("funcionaaa", data)
        }
      ),
        error => {
          console.error(error);
        }
    }
  }


  onFileSelecteds(event: any, field: string) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      let maxSize = 0;
  
      if (field === 'urlImagen') {
        maxSize = 5 * 1024 * 1024; // 5MB para imágenes
      } 
  
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
        this.alertService.errorAlert('Error', `El archivo es demasiado grande. El tamaño máximo permitido es ${maxSizeMB} MB.`);
        this.resetFileField(field);
  
        ////Limpia el archivo seleccionado y resetea la previsualización
        event.target.value = ''; // Borra la selección del input
  
        // Resetea el campo correspondiente en el formulario y la previsualización
        if (field === 'urlImagen') {
          this.bannerForm.patchValue({ urlImagen: null });
          this.selectedBanner = null;
          this.bannerPreview = null; // Resetea la previsualización
        }
        this.resetFileField(field);
        return;
      }

      const reader = new FileReader();
    reader.onload = (e: any) => {
      const previewUrl = e.target.result;
      if (field === 'urlImagen') {
        this.bannerForm.patchValue({ urlImagen: previewUrl });
        this.bannerPreview = previewUrl;
      }
    };
    reader.readAsDataURL(file);
  
      // Genera la previsualización solo si el archivo es de tamaño permitido
      this.generateImagePreview(file, field);

      if (field === 'urlImagen') {
        this.selectedBanner = file;
        this.bannerForm.patchValue({ urlImagen: file });
      }
      
  } else {
    this.resetFileField(field);
  }
  }

  resetFileField(field: string) {
    if (field === 'urlImagen') {
      this.bannerForm.patchValue({ urlImagen: null });
      this.selectedBanner = null;
      this.bannerPreview = null;
    }
  }

  generateImagePreview(file: File, field: string) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (field === 'urlImagen') {
        this.bannerPreview = e.target.result;
      }
      this.cdRef.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  /* Cerrar el modal */
  cancelarModal() {
    this.dialogRef.close();
  }



}
