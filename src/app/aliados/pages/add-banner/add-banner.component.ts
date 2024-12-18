import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { User } from '../../../Modelos/user.model';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AliadoService } from '../../../servicios/aliado.service';
import { AlertService } from '../../../servicios/alert.service';
import { faCircleQuestion, faImage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrl: './add-banner.component.css'
})
export class AddBannerComponent {
  currentRolId: number;
  user: User | null = null;
  token: string;
  id: number | null = null;
  id_banner: number | null = null;
  bannerForm: FormGroup;
  selectedBanner: File | null = null;
  idAliado: any | null = null;
  bannerPreview: string | ArrayBuffer | null = null;
  isActive: boolean = true;
  boton: boolean;
  falupa = faCircleQuestion;
  faImages = faImage;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<AddBannerComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private aliadoService: AliadoService,
    private alertService: AlertService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.id_banner = data.id;

    this.bannerForm = this.formBuilder.group({
      urlImagen: [null, Validators.required],
      estadobanner: [1],
    });

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
        this.id = this.user.id;
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

  /* Inicializa con esas funciones al cargar la pagina */

  ngOnInit(): void {
    this.validateToken();
    this.verEditar();
    this.mostrarToggle();
    this.toggleActive();
  }

  /*
     Este método permite a los usuarios editar la información de un banner 
      existente, asegurando que el formulario se complete correctamente con 
      los datos actuales del banner.
  */

  verEditar(): void {
    this.aliadoService.getBannerxid(this.token, this.id_banner).subscribe(
      data => {
        this.bannerForm.patchValue({
          urlImagen: data.urlImagen,
          estadobanner: data.estadobanner === 'Activo' || data.estadobanner === true || data.estadobanner === 1
        });
        this.isActive = data.estadobanner === 'Activo' || data.estadobanner === true || data.estadobanner === 1;
        this.bannerForm.patchValue({ estadobanner: this.isActive });
      },
      error => {
        console.error(error);
      }
    )
  }

  /*
   Este método permite gestionar tanto la creación como la edición de banners 
   de manera efectiva, asegurando que se manejen los datos de manera adecuada 
    y se informe al usuario sobre el resultado de la operación.
  */

  addBanner(): void {
    const formData = new FormData();
    let aliado_modal = this.idAliado;
    let estadoValue: string;
    if (this.id_banner == null) {
      estadoValue = '1';
    } else {
      estadoValue = this.isActive ? '1' : '0';
    }
    if (this.selectedBanner) {
      formData.append('urlImagen', this.selectedBanner, this.selectedBanner.name);
    }
    formData.append('estadobanner', estadoValue);
    formData.append('id_aliado', aliado_modal);
    if (this.id_banner != null) {
      this.aliadoService.editarBanner(this.token, this.id_banner, formData).subscribe(
        data => {
          this.alertService.successAlert('Exito', data.message);
          localStorage.removeItem(`banners:activo`);
          this.dialogRef.close();
        },
        error => {
          console.error(error);
          this.alertService.errorAlert('Error', error.error.message);
        }
      )
    } else {
      this.aliadoService.crearBanner(this.token, formData).subscribe(
        data => {
          this.alertService.successAlert('Exito', data.message);
          localStorage.removeItem(`banners:activo`);
          this.dialogRef.close();
        },
        error => {
          this.alertService.errorAlert('Error', error.error.message);
          console.error(error);
        });
    }
  }

  /*
    Este método maneja la selección de archivos desde un input de tipo archivo. 
    Verifica si hay archivos seleccionados y, si es así, comprueba su tamaño.
  */
  onFileSelecteds(event: any, field: string) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      let maxSize = 0;
      if (field === 'urlImagen') {
        maxSize = 5 * 1024 * 1024;
      }
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
        this.alertService.errorAlert('Error', `El archivo es demasiado grande. El tamaño máximo permitido es ${maxSizeMB} MB.`);
        this.resetFileField(field);
        event.target.value = '';
        if (field === 'urlImagen') {
          this.bannerForm.patchValue({ urlImagen: null });
          this.selectedBanner = null;
          this.bannerPreview = null;
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
      this.generateImagePreview(file, field);
      if (field === 'urlImagen') {
        this.selectedBanner = file;
        this.bannerForm.patchValue({ urlImagen: file });
      }
    } else {
      this.resetFileField(field);
    }
  }

  /*
   Este método se encarga de restablecer el campo de archivo a su estado inicial, 
   eliminando cualquier valor previamente asignado.
   */
  resetFileField(field: string) {
    if (field === 'urlImagen') {
      this.bannerForm.patchValue({ urlImagen: null });
      this.selectedBanner = null;
      this.bannerPreview = null;
    }
  }

  /*
    Este método utiliza `FileReader` para crear una vista previa de la imagen 
    seleccionada, actualizando la propiedad correspondiente en el componente.
  */
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

  /*
  Este método es útil en situaciones donde el usuario decide no continuar 
  con la acción actual y desea salir del modal de manera limpia y rápida.
  */
  cancelarModal() {
    this.dialogRef.close();
  }

  /*
  Este método se utiliza para simular un clic en un 
  elemento de entrada de archivo, lo que abre el diálogo de selección de 
  archivos del sistema operativo.
*/
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  /*
    Este método es útil para gestionar la activación/desactivación de un banner en la interfaz de usuario.
  */
  toggleActive() {
    this.isActive = !this.isActive;
    this.bannerForm.patchValue({ estadobanner: this.isActive });
  }

  /*
  Este método gestiona la visibilidad de un botón en la interfaz de usuario. 
*/
  mostrarToggle(): void {
    this.boton = this.id_banner != null;
  }

}
