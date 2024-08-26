import { Component, OnInit, Input, Inject, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { faMagnifyingGlass, faPenToSquare, faPlus, faXmark, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { SuperadminService } from '../../../servicios/superadmin.service';
import { Superadmin } from '../../../Modelos/superadmin.model';
import { User } from '../../../Modelos/user.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertService } from '../../../servicios/alert.service';
import { DepartamentoService } from '../../../servicios/departamento.service';
import { MunicipioService } from '../../../servicios/municipio.service';
import { EmprendedorService } from '../../../servicios/emprendedor.service';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-modal-crear-superadmin',
  templateUrl: './modal-crear-superadmin.component.html',
  styleUrl: './modal-crear-superadmin.component.css'
})
export class ModalCrearSuperadminComponent implements OnInit {
  @Input() isEditing: boolean = false
  submitted: boolean = false;
  token: string | null = null;
  user: User | null = null;
  id: number | null = null;
  currentRolId: string | null = null;
  adminId: any;
  hide = true;
  falupa = faCircleQuestion;
  estado: boolean;
  isActive: boolean = true;
  boton = true;
  ////
  listDepartamentos: any[] = [];
  listMunicipios: any[] = [];
  listTipoDocumento: any[] = [];
  ///
  imagenPerlil_Preview: string | ArrayBuffer | null = null;
  selectedImagen_Perfil: File | null = null;
  formSubmitted = false;


  superadminForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    documento: ['', Validators.required],
    imagen_perfil: [null, Validators.required],
    celular: ['', Validators.required],
    genero: ['', Validators.required],
    direccion: [ ],
    id_tipo_documento: ['', Validators.required],
    id_departamento:['', Validators.required],
    id_municipio:['', Validators.required],
    fecha_nac: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    estado: true,
  });

  constructor(public dialogRef: MatDialogRef<ModalCrearSuperadminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private superadminService: SuperadminService,
    private departamentoService: DepartamentoService,
    private municipioService: MunicipioService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) {
    this.adminId = data.adminId;

  }

  /* Inicializa con esas funciones al cargar la pagina, 
  con los validator verificando cuando es editando y cuando es creando para que no salga error el campo vacio */
  ngOnInit(): void {
    this.validateToken();
    if (this.adminId != null) {
      this.isEditing = true;
      this.superadminForm.get('password')?.setValidators([Validators.minLength(8)]);
      this.verEditar();
    } else {
      this.superadminForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }

    this.superadminForm.get('password')?.updateValueAndValidity();
    this.cargarDepartamentos();
    this.tipoDocumento();
  }

  get f() { return this.superadminForm.controls; } /* Validaciones */

  /* Valida el token del login */
  validateToken(): void {
    if (!this.token) {
      this.token = localStorage.getItem("token");
    }
    if (!this.token) {
      this.router.navigate(['home']);
    }
  }

 

  /* Validaciones la contraseña */
  passwordValidator(control: AbstractControl) {
    const value = control.value;
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

    if (hasUpperCase && hasSpecialChar) {
      return null;
    } else {
      return { passwordStrength: 'La contraseña debe contener al menos una letra mayúscula y un carácter especial *' };
    }
  }

  /* Trae la informacion del admin cuando el adminId no sea nulo */
  verEditar(): void {
    if (this.adminId != null) {
      this.superadminService.getsuperadmin(this.token, this.adminId).subscribe(
        data => {
          this.superadminForm.patchValue({
            nombre: data.nombre,
            apellido: data.apellido,
            documento: data.documento,
            id_tipo_documento: data.id_tipo_documento,
            imagen_perfil: data.imagen_perfil,
            genero: data.genero,
            direccion: data.direccion,
            fecha_nac: data.fecha_nac,
            celular: data.celular,
            id_departamento: data.departamento,
            id_municipio:data.municipio,
            email: data.email,
            password: '',
            estado: data.estado,
          });
          console.log('datos: ',data)
          this.isActive = data.estado === 'Activo';
          setTimeout(() => {
            this.superadminForm.get('estado')?.setValue(this.isActive);
          });
        },
        error => {
          console.error(error);
        }
      )
    }
  }


  /* Crear super admin o actualiza dependendiendo del adminId */
  addSuperadmin(): void {
    const formData = new FormData();
    let estadoValue: string;
    if (this.adminId == null) {
      estadoValue = '1';
    }else{
    }
    formData.append('nombre', this.superadminForm.get('nombre')?.value);
    formData.append('apellido', this.superadminForm.get('apellido')?.value);
    formData.append('documento', this.superadminForm.get('documento')?.value);
    formData.append('celular', this.superadminForm.get('celular')?.value);
    formData.append('genero', this.superadminForm.get('genero')?.value);

    if (this.superadminForm.get('direccion')?.value) {
      formData.append('direccion', this.superadminForm.get('direccion')?.value);
    } else { }

    //formData.append('direccion', this.superadminForm.get('direccion')?.value);  //toca cambiarlo
    formData.append('id_tipo_documento', this.superadminForm.get('id_tipo_documento')?.value);
    formData.append('departamento', this.superadminForm.get('id_departamento')?.value);
    formData.append('municipio', this.superadminForm.get('id_municipio')?.value);
    formData.append('email', this.superadminForm.get('email')?.value);
    formData.append('password', this.superadminForm.get('password')?.value);
    
    Object.keys(this.superadminForm.controls).forEach((key) => {
      const control = this.superadminForm.get(key);
      if (control?.value !== null && control?.value !== undefined) {
        if (key === 'fecha_nac') {
          if (control.value) {
            const date = new Date(control.value);
            if (!isNaN(date.getTime())) {
              formData.append(key, date.toISOString().split('T')[0]);
            }
          }
        } else if (key === 'estado') {
          // Convertir el valor booleano a 1 o 0
          formData.append(key, control.value ? '1' : '0');
        } else if (key !== 'imagen_perfil') {
          formData.append(key, control.value);
        } 
      }
    });

    if (this.selectedImagen_Perfil) {
      formData.append(
        'imagen_perfil',
        this.selectedImagen_Perfil,
        this.selectedImagen_Perfil.name
      );
    }

    console.log('Datos del formulario:', this.superadminForm.value);



    /* Actualiza superadmin */
    if (this.adminId != null) {
      let confirmationText = this.isActive
        ? "¿Estas seguro de guardar los cambios"
        : "¿Estas seguro de guardar los cambios?";

      this.alertService.alertaActivarDesactivar(confirmationText, 'question').then((result) => {
        if (result.isConfirmed) {
          this.superadminService.updateAdmin(this.token, this.adminId, formData).subscribe(
            data => {
              location.reload();
              console.log(data);
              this.alertService.successAlert('Exito', 'Actualizacion exitosa')
            },
            error => {
              console.error(error);
              if (error.status === 400) {
                this.alertService.errorAlert('Error', error.error.message)
              }
            }
          )
        }
      });
      /* Crea superadmin */
    } else {
      this.superadminService.createSuperadmin(this.token, formData).subscribe(
        data => {
          location.reload();
          console.log(data);
          this.alertService.successAlert('Exito', data.message);
        },
        error => {
          console.error(error);
          if (error.status === 400) {
            this.alertService.errorAlert('Error', error.error.message)
          }

        }

      );
    }
  }

  /* Cambia el estado del toggle*/
  toggleActive() {
    this.isActive = !this.isActive;
    this.superadminForm.patchValue({ estado: this.isActive ? true : false });

  }

  /* Muestra el toggle del estado dependiendo del adminId que no sea nulo*/
  mostrarToggle(): void {
    if (this.adminId != null) {
      this.boton = false;
    }
    this.boton = true;
  }

  /* Cerrar el modal */
  cancelarcrerSuperadmin() {
    this.dialogRef.close();
  }

  //Funcion para cargar los departamentos
  cargarDepartamentos(): void {
    this.departamentoService.getDepartamento().subscribe(
      (data: any[]) => {
        this.listDepartamentos = data;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  onDepartamentoSeleccionado(event: Event): void {
    const target = event.target as HTMLSelectElement; // Cast a HTMLSelectElement
    const selectedDepartamento = target.value;

    // Guarda el departamento seleccionado en el localStorage
    localStorage.setItem('departamento', selectedDepartamento);

    // Llama a cargarMunicipios si es necesario
    this.cargarMunicipios(selectedDepartamento);
  }

  cargarMunicipios(idDepartamento: string): void {
    this.municipioService.getMunicipios(idDepartamento).subscribe(
      data => {
        this.listMunicipios = data;
        //console.log('Municipios cargados:', JSON.stringify(data));
      },
      err => {
        console.log('Error al cargar los municipios:', err);
      }
    );
  }

  tipoDocumento(): void {
    this.authService.tipoDocumento().subscribe(
      data => {
        this.listTipoDocumento = data;

        //console.log('tipos de documentos', this.listTipoDocumento);
        //console.log('datos tipo de documento: ',data)
      },
      error => {
        console.log(error);
      }
    )
  }

  onFileSelecteds(event: any, field: string) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      let maxSize = 0;

      if (field === 'imagen_perfil') {
        maxSize = 5 * 1024 * 1024; // 5MB para imágenes
      }

      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
        this.alertService.errorAlert(
          'Error',
          `El archivo es demasiado grande. El tamaño máximo permitido es ${maxSizeMB} MB.`
        );
        this.resetFileField(field);

        ////Limpia el archivo seleccionado y resetea la previsualización
        event.target.value = ''; // Borra la selección del input

        // Resetea el campo correspondiente en el formulario y la previsualización
        if (field === 'imagen_perfil') {
          this.superadminForm.patchValue({ imagen_perfil: null });
          this.imagenPerlil_Preview = null; // Resetea la previsualización
        }
        this.resetFileField(field);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const previewUrl = e.target.result;
        if (field === 'imagen_perfil') {
          this.superadminForm.patchValue({ imagen_perfil: previewUrl });
          this.imagenPerlil_Preview = previewUrl;
        }
      };
      reader.readAsDataURL(file);

      // Genera la previsualización solo si el archivo es de tamaño permitido
      this.generateImagePreview(file, field);

      if (field === 'imagen_perfil') {
        this.selectedImagen_Perfil = file;
        this.superadminForm.patchValue({ imagen_perfil: file });
      }
    } else {
      this.resetFileField(field);
    }
  }
  resetFileField(field: string) {
    if (field === 'imagen_perfil') {
      this.superadminForm.patchValue({ imagen_perfil: null });
      this.imagenPerlil_Preview = null;
    }
  }
  generateImagePreview(file: File, field: string) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (field === 'imagen_perfil') {
        this.imagenPerlil_Preview = e.target.result;
      }
      this.cdRef.detectChanges();
    };
    reader.readAsDataURL(file);
  }

}