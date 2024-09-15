import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../../Modelos/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperadminService } from '../../../../servicios/superadmin.service';
import { Asesor } from '../../../../Modelos/asesor.model';
import { ActividadService } from '../../../../servicios/actividad.service';
import { faImage, faFilePdf, } from '@fortawesome/free-solid-svg-icons';
import { Actividad } from '../../../../Modelos/actividad.model';
import { Aliado } from '../../../../Modelos/aliado.model';
import { Superadmin } from '../../../../Modelos/superadmin.model';
import { AliadoService } from '../../../../servicios/aliado.service';
import Pica from 'pica';
import { NivelService } from '../../../../servicios/nivel.service';
import { Nivel } from '../../../../Modelos/nivel.model';
import { AlertService } from '../../../../servicios/alert.service';
import { LeccionService } from '../../../../servicios/leccion.service';
import { Leccion } from '../../../../Modelos/leccion.model';
import { ContenidoLeccionService } from '../../../../servicios/contenido-leccion.service';
import { Contenido_Leccion } from '../../../../Modelos/contenido-leccion.model';

@Component({
  selector: 'app-actnivlec',
  templateUrl: './actnivlec.component.html',
  styleUrl: './actnivlec.component.css'
})
export class ActnivlecComponent implements OnInit {
  token: string | null = null;
  user: User | null = null;
  id: number | null = null;
  currentRolId: number;
  listaAsesorAliado: Asesor[] = [];
  listarTipoDato: Actividad[] = [];
  listarTipoDatoContenido: Contenido_Leccion[] = [];
  listarAliadoo: Aliado[] = [];
  listarNiveles: Nivel[] = [];
  listarLeccion: Leccion[] = [];
  listActividadContenido: Actividad[] = [];
  ///
  listarAsesores: any[] = [];
  userFilter: any = { nombre: '', estado: 'Activo' };
  aliadoSeleccionado: any | null;
  rutaId: number | null = null;
  actividadId: number | null = null;
  nivelSeleccionado: any | null;
  ////
  currentIndex: number = 0;
  /////
  faImages = faImage;
  faFile = faFilePdf;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileInputs') fileInputs: ElementRef;
  fuentePreview: string | ArrayBuffer | null = null;
  fuentePreviewContenido: string | ArrayBuffer | null = null;
  selectedfuente: File | null = null;
  selectedfuenteContenido: File | null = null;
  idactividad: string | null;
  idcontenidoLeccion: string;
  camposDeshabilitados: boolean = false;
  ////
  fuente: string = '';
  fuente_contenido: string = '';
  submittedActividad = false;
  submittedNivel = false;
  submittedLeccion = false;
  submittedContent = false;
  submitted = false;

  niveles: any[] = [];
  leccioon: any[] = [];
  isEditing: any;
  contenidoLeccion: any[] = [];

  showVideo: boolean = false;
  showImagen: boolean = false;
  showPdf: boolean = false;
  showTexto: boolean = false;
  Number = Number;

  selectedNivelId: any | null = null;
  selectedLeccion: any | null = null;

  ////añadir actividad
  actividadForm = this.fb.group({
    id: [],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    fuente: ['', Validators.required],
    id_tipo_dato: ['', Validators.required],
    id_asesor: [],
    id_ruta: ['', Validators.required],
    id_aliado: ['', Validators.required]
  })
  ////anadir nivel

  nivelForm = this.fb.group({
    id_nivel: [],
    nombre: [{ value: '', disabled: true }, Validators.required],
    id_actividad: [{ value: '', disabled: true }, Validators.required]
  })
  mostrarNivelForm: boolean = false;

  ///// añadir leccion
  leccionForm = this.fb.group({
    id_leccion: [''],
    nombre: [{ value: '', disabled: true }, Validators.required],
    id_nivel: [{ value: '', disabled: true }, Validators.required]
  })
  mostrarLeccionForm: boolean = false;

  ///añadir contenido por leccion

  contenidoLeccionForm = this.fb.group({
    id_contenido: [''],
    titulo: [{ value: '', disabled: true }, Validators.required],
    descripcion: [{ value: '', disabled: true }, Validators.required],
    fuente_contenido: [{ value: '', disabled: true }, Validators.required],
    id_tipo_dato: [{ value: '', disabled: true }, Validators.required],
    id_leccion: [{ value: '', disabled: true }, Validators.required]
  })
  mostrarContenidoLeccionForm: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private superAdminService: SuperadminService,
    private actividadService: ActividadService,
    private aliadoService: AliadoService,
    private route: ActivatedRoute,
    private nivelService: NivelService,
    private cdRef: ChangeDetectorRef,
    private alertServices: AlertService,
    private leccionService: LeccionService,
    private contenidoLeccionService: ContenidoLeccionService,
  ) { }

  ngOnInit(): void {
    this.validateToken();

    this.route.queryParams.subscribe(params => {
      console.log('params:', params);
      if (params['id_ruta']) {
        this.rutaId = +params['id_ruta'];
        this.actividadForm.patchValue({ id_ruta: this.rutaId.toString() });
      }
      if (params['id_actividad']) {
        this.actividadId = +params['id_actividad'];
        this.actividadForm.patchValue({ id: this.actividadId.toString() });
      }
      if (params['isEditing']) {
        this.isEditing = params['isEditing'] === 'true';
      }
    });
    this.tipoDato();
    this.initializeNivelForm();
    this.tipoDatoContenido();
    this.verLeccicon();
    this.verNivel();
    this.verEditar();
    this.listaAliado();
    this.onAliadoChange();
    this.bloquearBotones();

    const idLeccion = this.contenidoLeccionForm.get('id_leccion')?.value;
  if (idLeccion) {
    this.onLeccionChange(idLeccion); // Llama la función que carga las lecciones
  }
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

  //me trae el tipo de dato que requiere la actividad
  tipoDato(): void {
    if (this.token) {
      this.actividadService.getTipoDato(this.token).subscribe(
        data => {

          this.listarTipoDato = data.filter((tipo: any) => tipo.nombre === 'Imagen'); //solo me muestra imagen en el select tipo dato
          // console.log('tipo de dato:', this.listarTipoDato);
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  get a() {
    return this.actividadForm.controls;
  }
  get n() {
    return this.nivelForm.controls;
  }
  get l() {
    return this.leccionForm.controls;
  }
  get cl() {
    return this.contenidoLeccionForm.controls;
  }

  tipoDatoContenido(): void {
    if (this.token) {
      this.contenidoLeccionService.getTipoDato(this.token).subscribe(
        data => {
          this.listarTipoDatoContenido = data;
          //console.log('tipo de dato contenido:', data);
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  //me lista los aliados existentes activos
  listaAliado(): void {
    if (this.token) {
      this.superAdminService.listarAliado(this.token).subscribe(
        data => {
          this.listarAliadoo = data;
          //console.log('Aliado: ', data)
        },
        error => {
          console.log(error);
        }
      )
    }
  }
  selectAliado(aliado: any): void {
    this.aliadoSeleccionado = aliado;
    //console.log("el aliado seleccionado fue: ", this.aliadoSeleccionado)
  }

  onAliadoChange(event?: any): void {
    let aliadoId: any;

    // Comprueba si event existe y tiene la estructura esperada
    if (event && event.target && event.target.value) {
      aliadoId = event.target.value;
    } else if (this.aliadoSeleccionado) {
      // Si no hay evento, usa el ID del aliado seleccionado actualmente
      aliadoId = this.aliadoSeleccionado.id;
    } else {
      console.error('No se pudo obtener el ID del aliado');
      return;
    }
    const aliadoSeleccionado = this.listarAliadoo.find(aliado => aliado.id == aliadoId);
    if (aliadoSeleccionado) {
      console.log("El aliado seleccionado fue: ", {
        id: aliadoSeleccionado.id,
        nombre: aliadoSeleccionado.nombre
      });
      this.aliadoSeleccionado = aliadoSeleccionado;
      if (this.token) {
        this.aliadoService.getinfoAsesor(this.token, this.aliadoSeleccionado.id, this.userFilter.estado).subscribe(
          data => {
            this.listarAsesores = data;
            console.log('Asesores: ', data);
          },
          error => {
            console.log(error);
          }
        );
      }
    } else {
      console.error('No se encontró el aliado seleccionado');
    }
  }

  verNivel(): void {
    if (this.token) {
      this.nivelService.mostrarNivelXidActividad(this.token, parseInt(this.nivelForm.value.id_actividad)).subscribe(
        data => {
          this.listarNiveles = data;
          this.niveles = data;
          console.log('Niveles: ', data);
        },
        error => {
          console.log(error);
        }
      )
    }
  }
  verEditar(): void {
    if (this.actividadId !== null) {
      this.actividadService.ActiNivelLeccionContenido(this.token, this.actividadId).subscribe(
        data => {
          this.listActividadContenido = data;
          this.aliadoService.getinfoAsesor(this.token, data.id_aliado, this.userFilter.estado).subscribe(
            asesoresData => {
              this.listarAsesores = asesoresData;
              // Actualizar el formulario de actividad
              this.actividadForm.patchValue({
                nombre: data.nombre,
                descripcion: data.descripcion,
                id_tipo_dato: data.id_tipo_dato,
                id_asesor: data.id_asesor,
                id_aliado: data.id_aliado,
                fuente: data.fuente,
                id_ruta: data.id_ruta,
              });
              this.niveles = data.nivel;
              this.nivelForm.patchValue({ id_actividad: this.actividadId.toString() });

              this.initializeNivelForm();

              this.activivarFormulariosBotones();
              console.log('Actividad: ', data);
            },
            error => {
              console.log('Error al cargar los asesores:', error);
            }
          );
        },
        error => {
          console.log('Error al cargar la actividad: ', error);
        }
      );
    }
  }

  initializeNivelForm(): void {
    if (this.niveles && this.niveles.length > 0) {
      // Si hay niveles, seleccionar el primero
      const primerNivel = this.niveles[0];
      this.nivelForm.patchValue({
        id_nivel: primerNivel.id,
        nombre: primerNivel.nombre
      });
      //this.nivelForm.disable();

      // Cargar las lecciones del primer nivel
      this.onNivelChange(primerNivel.id.toString());
    } else {
      // Si no hay niveles, preparar para agregar uno nuevo
      this.nivelForm.patchValue({
        id_nivel: '',
        nombre: ''
      });
      this.nivelForm.get('nombre')?.disable();
    } 
    if (this.contenidoLeccion && this.contenidoLeccion.length > 0) {
      const primerContenido = this.contenidoLeccion[0];
      this.contenidoLeccionForm.patchValue({
        id_leccion: primerContenido.id,
        titulo: primerContenido.titulo,
        descripcion: primerContenido.descripcion,
        id_tipo_dato: primerContenido.id_tipo_dato,
        fuente_contenido: primerContenido.fuente_contenido
      })
    }
  }


  addActividadSuperAdmin(): void {
    this.submitted = true;
    const formData = new FormData();
    let estadoValue: string;
    const nombreActividad = this.actividadForm.get('nombre')?.value;
    if (nombreActividad && nombreActividad.length > 39) {
      this.alertServices.errorAlert('Error', 'El nombre de la actividad no puede tener más de 39 caracteres');
      return;
    } if (this.actividadId != null) {
      if (this.actividadForm.invalid) {
        this.alertServices.errorAlert('Error', 'Debes completar todos los campos requeridos de la actividad');
        return;
      }
    }
    if (this.idactividad == null) {
      estadoValue = '1'
    } else {
    }
    formData.append('nombre', this.actividadForm.get('nombre')?.value);
    formData.append('descripcion', this.actividadForm.get('descripcion')?.value);
    formData.append('id_tipo_dato', this.actividadForm.get('id_tipo_dato')?.value);
    formData.append('id_asesor', this.actividadForm.get('id_asesor')?.value || '');
    formData.append('id_ruta', this.rutaId.toString());
    formData.append('id_aliado', this.actividadForm.get('id_aliado')?.value);
    formData.append('estado', estadoValue);
    console.log('datos: ', this.actividadForm.value);
    if (this.selectedfuente) {
      formData.append('fuente', this.selectedfuente, this.selectedfuente.name);
    } else {
      const rutaMultiValue = this.actividadForm.get('fuente')?.value;
      if (rutaMultiValue) {
        formData.append('fuente', rutaMultiValue);
      }
      console.log('datos enviados: ', formData)
    }
    if (this.actividadId == null) {
      this.alertServices.alertaActivarDesactivar("¿Estas seguro de guardar los cambios? Verifica los datos ingresados, una vez guardados solo se podran modificar en el apartado de editar", 'question').then((result) => {
        if (result.isConfirmed) {

          this.superAdminService.crearActividadSuperAdmin(this.token, formData).subscribe(
            (data: any) => {
              const actividadCreada = data[0];
              this.nivelForm.patchValue({ id_actividad: actividadCreada.id });
              //this.mostrarNivelForm = true;
              this.alertServices.successAlert('Exito', data.message);
              this.desactivarcamposActividad();
              console.log('datos enviados: ', data)
              this.activarformularios();
              this.habilitarBotones();
            },
            error => {
              console.log(error);
              this.alertServices.errorAlert('Error', error.error.message);
            }
          );
        }
      })
    } else {
      this.alertServices.alertaActivarDesactivar("¿Estas seguro de guardar los cambios? Verifica los datos ingresados, una vez guardados solo se podran modificar en el apartado de editar", 'question').then((result) => {
        if (result.isConfirmed) {
          this.actividadService.updateActividad(this.token, this.actividadId, formData).subscribe(
            data => {
              this.alertServices.successAlert('Exito', data.message);
            },
            error => {
              console.log(error);
              this.alertServices.errorAlert('Error', error.error.message);
            }
          )
        }
      })
    }
  }

  desactivarcamposActividad(): void {
    this.actividadForm.disable();
    const guardarBtn = document.getElementById('guardarBtn') as HTMLButtonElement;
    if (guardarBtn) {
      guardarBtn.disabled = true;
      guardarBtn.style.cursor = 'not-allowed'; // Cambia el cursor para indicar que está deshabilitado
    }
    const fuente = document.getElementById('fuente') as HTMLButtonElement;
    if (fuente) {
      fuente.disabled = true;
      fuente.classList.add('disabled-btn');
    }
  }

  activarformularios(): void {
    this.nivelForm.enable(); // Habilita el formulario de niveles
    this.leccionForm.enable();
    this.contenidoLeccionForm.enable();
  }

  activivarFormulariosBotones(): void {
    this.nivelForm.enable();
    this.leccionForm.enable();
    this.contenidoLeccionForm.enable();
    this.actividadForm.enable();
    this.habilitarBotones();
  }

  bloquearBotones(): void {
    const agregarNivelBtn = document.getElementById('agregarNivelBtn') as HTMLAnchorElement;
    if (agregarNivelBtn) {
      agregarNivelBtn.style.pointerEvents = 'none';
      agregarNivelBtn.style.opacity = '0.5';
    }

    const agregarLeccionBtn = document.getElementById('agregarLeccionBtn') as HTMLAnchorElement;
    if (agregarLeccionBtn) {
      agregarLeccionBtn.style.pointerEvents = 'none';
      agregarLeccionBtn.style.opacity = '0.5';
    }

    const agregarContenidoBtn = document.getElementById('agregarContenidoBtn') as HTMLAnchorElement;
    if (agregarContenidoBtn) {
      agregarContenidoBtn.style.pointerEvents = 'none';
      agregarContenidoBtn.style.opacity = '0.5';
    }
  }
  habilitarBotones(): void {
    const agregarNivelBtn = document.getElementById('agregarNivelBtn') as HTMLAnchorElement;
    if (agregarNivelBtn) {
      agregarNivelBtn.style.pointerEvents = 'auto';
      agregarNivelBtn.style.opacity = '1';
    }
    const agregarLeccionBtn = document.getElementById('agregarLeccionBtn') as HTMLAnchorElement;
    if (agregarLeccionBtn) {
      agregarLeccionBtn.style.pointerEvents = 'auto';
      agregarLeccionBtn.style.opacity = '1';
    }
    const agregarContenidoBtn = document.getElementById('agregarContenidoBtn') as HTMLAnchorElement;
    if (agregarContenidoBtn) {
      agregarContenidoBtn.style.pointerEvents = 'auto';
      agregarContenidoBtn.style.opacity = '1';
    }
  }

  addNivelSuperAdmin(): void {
    this.submittedNivel = true;
    const nombreNivel = this.nivelForm.get('nombre')?.value;
    if (nombreNivel && nombreNivel.length > 70) {
      this.alertServices.errorAlert('Error', 'El nombre del nivel no puede tener más de 70 caracteres');
      return;
    }
    const nivel: any = {
      nombre: nombreNivel,
      id_actividad: this.nivelForm.value.id_actividad
      //id_actividad: this.actividadId
    };
    console.log("idnivel", this.selectedNivelId);
    if (this.selectedNivelId) {
      const nivelId = this.nivelForm.get('id_nivel')?.value;
      this.nivelService.updateNivel(this.token, nivelId, nivel).subscribe(
        (data) => {
          this.alertServices.successAlert('Exito', 'Nivel actualizado correctamente');
          this.niveles.push({
            id: data.id,
            nombre: data.nombre
          });
          this.nivelForm.patchValue({
            id_nivel: data.id
          });
          this.verNivel();
          this.nivelForm.reset();
          this.submittedNivel = false;
          this.nivelForm.patchValue({ id_actividad: nivel.id_actividad });
        },
        error => {
          this.alertServices.errorAlert('Error', error.error.message);
          console.log(error);
        }
      );
    } else {
      if (this.nivelForm.invalid) {
        this.alertServices.errorAlert('Error', 'Debes completar todos los campos requeridos del nivel');
        return;
      }
      console.log('nivel data', nivel);
      this.superAdminService.crearNivelSuperAdmin(this.token, nivel).subscribe(
        (data: any) => {
          this.alertServices.successAlert('Exito', data.message);
          // Actualizar la lista de niveles
          this.niveles.push({
            id: data.id,
            nombre: data.nombre
          });

          // Actualizar el select
          this.nivelForm.patchValue({
            id_nivel: data.id
          });
          this.leccionForm.patchValue({ id_nivel: data.id })
          this.verNivel();
          this.nivelForm.reset();
          this.submittedNivel = false;
          this.nivelForm.patchValue({ id_actividad: nivel.id_actividad });
          this.alertServices.successAlert('Éxito', 'Nivel creado correctamente')
        },
        error => {
          this.alertServices.errorAlert('Error', error.error.message);
          console.log(error);
        }
      )
    } 
  }

  addLeccionSuperAdmin(): void {
    this.submittedLeccion = true;
    const nombreLeccion = this.leccionForm.get('nombre')?.value;
    if (nombreLeccion && nombreLeccion.length > 70) {
      this.alertServices.errorAlert('Error', 'El nombre de la lección no puede tener más de 70 caracteres');
      return;
    }
    if (this.leccionForm.invalid) {
      this.alertServices.errorAlert('Error', 'Debes completar todos los campos requeridos de la lección');
      return;

    }
    const leccion: any = {
      nombre: nombreLeccion,
      id_nivel: this.leccionForm.value.id_nivel
    }
    //const leccionId = +this.leccionForm.get('id_leccion')?.value;
    const leccionId = +this.leccionForm.get('id_leccion')?.value;
    if (leccionId) {
      //console.log("leccionIddddddddd", leccionId);
      const leccionId = +this.leccionForm.get('id_leccion')?.value;
      this.leccionService.updateLeccion(this.token, leccionId, leccion).subscribe(
        (data) => {
          this.alertServices.successAlert('Exito', data.message);
          this.onNivelChange(this.leccionForm.value.id_nivel);
          //this.verLeccicon();
          this.leccionForm.reset();
          this.submittedLeccion = false;
          this.leccionForm.patchValue({ id_nivel: leccion.id_nivel });
          console.log('id leccion: ', data.id);
        },
        error => {
          this.alertServices.errorAlert('Error', error.error.message);
          console.log(error);
        }
      )
    } else {
      console.log('leccion data', leccion);
      this.superAdminService.crearLeccionSuperAdmin(this.token, leccion).subscribe(
        (data: any) => {
          console.log('datos recibidos', data);
          this.alertServices.successAlert('Exito', data.message);
          this.onNivelChange(this.leccionForm.value.id_nivel);
          this.contenidoLeccionForm.patchValue({ id_leccion: data.id })
          //this.verLeccicon();
          //this.mostrarContenidoLeccionForm = true;
          //this.mostrarContenidoLeccionForm = true;
          this.leccionForm.reset();
          this.submittedLeccion = false;
          this.leccionForm.patchValue({ id_nivel: leccion.id_nivel });
          console.log('id leccion: ', data.id);
        },
        error => {
          this.alertServices.errorAlert('Error', error.error.message);
          console.log(error);
        }
      )
    }
  }

  verLeccicon(): void {
    this.leccionService.LeccionxNivel(this.token, parseInt(this.leccionForm.value.id_nivel)).subscribe(
      data => {
        this.listarLeccion = data;
        if (data.length > 0) {
          // Seleccionar la primera lección si existe
          const primeraLeccion = data[0];
          this.leccionForm.patchValue({
            id_leccion: primeraLeccion.id.toString(),
            nombre: primeraLeccion.nombre
          });
          this.cargarContenidoLeccion(primeraLeccion.id);
        } else {
          // Si no hay lecciones, resetear el formulario de lección
          this.leccionForm.patchValue({
            id_leccion: '',
            nombre: ''
          });
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  onNivelChange(id_nivel: string): void {
    this.leccionForm.patchValue({ id_nivel: id_nivel }); // Actualizar el formulario con el nivel seleccionado
    this.leccionService.LeccionxNivel(this.token, parseInt(id_nivel)).subscribe(
      data => {
        this.listarLeccion = data;
        if (this.isEditing && data.length > 0) {
          // Seleccionar la primera lección si existe
          const primeraLeccion = data[0];
          this.leccionForm.patchValue({
            id_leccion: primeraLeccion.id.toString(),
            nombre: primeraLeccion.nombre
          });
          this.cargarContenidoLeccion(primeraLeccion.id);
        } else {
          // Si no hay lecciones, resetear el formulario de lección
          this.leccionForm.patchValue({
            id_leccion: '',
            nombre: ''
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  onLeccionChange(id_leccion: string): void {
    if (id_leccion && id_leccion !== '') {
      const selectedLeccion = this.listarLeccion.find(leccion => leccion.id === parseInt(id_leccion));
      if (selectedLeccion) {
        this.leccionForm.patchValue({
          id_leccion: selectedLeccion.id.toString(),
          nombre: selectedLeccion.nombre
        });

        // Actualizar también el formulario de contenido
        this.contenidoLeccionForm.patchValue({
          id_leccion: selectedLeccion.id.toString()
        });

        this.cargarContenidoLeccion(parseInt(id_leccion));
      }
    } else {
      this.leccionForm.patchValue({ //me limpia el campo de nombre cuando selecciono "agregar leccion"
        //id_leccion: '',
        nombre: ''
      });
      this.contenidoLeccionForm.patchValue({
        titulo: '',
        descripcion: '',
        id_contenido: '',
        id_leccion: '',
        id_tipo_dato: ''
      })
      this.contenidoLeccion = [];
    } 

    console.log('id_leccion actual en leccionForm:', this.leccionForm.get('id_leccion').value);
    console.log('id_leccion actual en contenidoLeccionForm:', this.contenidoLeccionForm.get('id_leccion').value);
  }



  // cargarContenidoLeccion(id_leccion: number):any{
  //   this.contenidoLeccionService.contenidoXleccion(this.token, id_leccion).subscribe(
  //     data => {
  //       this.contenidoLeccion = data;
  //       console.log('Contenido de la lección:', data);

  //       const currentIdLeccion = this.contenidoLeccionForm.get('id_leccion').value;
  //       this.contenidoLeccionForm.patchValue({
  //         id_leccion: currentIdLeccion,
  //         id_tipo_dato: data.id_tipo_dato,
  //         fuente_contenido: data.fuente_contenido
  //       });

  //       this.onTipoDatoChangeContenido();
  //     },
  //     error => {
  //       console.error('Error al cargar el contenido de la lección:', error);
  //     }
  //   )
  // }

  cargarContenidoLeccion(id_leccion: number): void {
    this.contenidoLeccionService.contenidoXleccion(this.token, id_leccion).subscribe(
      data => {
        this.contenidoLeccion = data;
        console.log('Contenido de la lección:', data);
        if (this.isEditing && data.length > 0) {
          const primerContenido = data[0];
          this.contenidoLeccionForm.patchValue({
            id_leccion: id_leccion.toString(),
            id_contenido: primerContenido.id.toString(),
            titulo: primerContenido.titulo,
            descripcion: primerContenido.descripcion,
            id_tipo_dato: primerContenido.id_tipo_dato,
            fuente_contenido: primerContenido.fuente_contenido
          });
        } else {
          // Limpiar todos los campos excepto id_leccion
          this.contenidoLeccionForm.reset({
            id_leccion: id_leccion.toString(), // Mantén solo el id_leccion
          });
        }
        this.onTipoDatoChangeContenido();
      },
      error => {
        console.error('Error al cargar el contenido de la lección:', error);
      }
    );
  }

  // onNivelSelect(event: any): void {
  //   const selectedNivelId = event.target.value;
  //   const selectedNivel = this.niveles.find(nivel => nivel.id === parseInt(selectedNivelId));
  //   if (selectedNivel) {
  //     this.nivelForm.patchValue({
  //       id_nivel: selectedNivel.id,
  //       nombre: selectedNivel.nombre
  //     });
  //   }
  // }
  onNivelSelect(event: any): void {
    const selectedNivelId = event.target.value;
    this.selectedNivelId = selectedNivelId !== '0' ? parseInt(selectedNivelId) : null;
    if (selectedNivelId === '0' ) {
      this.nivelForm.patchValue({ nombre: '', id_nivel: 0 });
      this.nivelForm.patchValue({ id_actividad: this.actividadId.toString() });
      this.contenidoLeccionForm.patchValue({
        titulo: '',
        descripcion: '',
        id_contenido: '',
        id_leccion: '',
        id_tipo_dato: ''
      })
      this.contenidoLeccion = [];
    } else {
      const selectedNivel = this.niveles.find(nivel => nivel.id === parseInt(selectedNivelId));
      if (selectedNivel) {
        this.nivelForm.patchValue({
          id_nivel: selectedNivel.id,
          nombre: selectedNivel.nombre
        });
      }
    }
  }

  addContenidoLeccionSuperAdmin(): void {
    this.submittedContent = true
    // if (this.contenidoLeccionForm.invalid) {
    //   this.alertServices.errorAlert('Error', 'Debes completar todos los campos requeridos del contenido');
    //   return;
    // }
    const idLeccion = this.contenidoLeccionForm.get('id_leccion')?.value;

    const tituloContenidoLeccion = this.contenidoLeccionForm.get('titulo')?.value;
    if (tituloContenidoLeccion && tituloContenidoLeccion.length > 70) {
      this.alertServices.errorAlert('Error', 'El titulo no puede tener más de 70 caracteres');
      return;
    }
    const descripcionContenidoLeccion = this.contenidoLeccionForm.get('descripcion')?.value;
    if (descripcionContenidoLeccion && descripcionContenidoLeccion.length > 470) {
      this.alertServices.errorAlert('Error', 'La descripción no puede tener más de 470 caracteres');
      return;
    }
    const formData = new FormData();
    formData.append('id_leccion', idLeccion);
    let estadoValue: string;
    if (this.idcontenidoLeccion == null) {
      estadoValue = 'true'
    } else {
    }
    formData.append('titulo', this.contenidoLeccionForm.get('titulo')?.value);
    formData.append('descripcion', this.contenidoLeccionForm.get('descripcion')?.value);
    formData.append('id_tipo_dato', this.contenidoLeccionForm.get('id_tipo_dato')?.value);
    //formData.append('id_leccion', this.contenidoLeccionForm.get('id_leccion')?.value);
    formData.append('id_leccion', idLeccion);
    console.log('id_leccion a enviar:', idLeccion);

    if (this.selectedfuenteContenido) {
      formData.append('fuente_contenido', this.selectedfuenteContenido, this.selectedfuenteContenido.name);
    } else {
      const rutaMultiValues = this.contenidoLeccionForm.get('fuente_contenido')?.value;
      if (rutaMultiValues) {
        formData.append('fuente_contenido', rutaMultiValues);
      }
    }
    const contenidoLeccionId = +this.contenidoLeccionForm.get('id_contenido')?.value;
    if (contenidoLeccionId) {
      console.log("conteido", contenidoLeccionId)
      this.contenidoLeccionService.updateContenidoLeccion(this.token, contenidoLeccionId, formData).subscribe(
        (data) => {
          this.alertServices.successAlert('Exito', data.message);
          console.log('datos recibidos: ', data);
          this.cargarContenidoLeccion(contenidoLeccionId);
          this.contenidoLeccionForm.reset();
          this.submittedContent = false;
          //location.reload();
        }
      )
    } else {
      this.superAdminService.crearContenicoLeccionSuperAdmin(this.token, formData).subscribe(
        (data: any) => {
          this.alertServices.successAlert('Exito', data.message);
          console.log('datos recibidos: ', data);
          this.cargarContenidoLeccion(+idLeccion);
          this.contenidoLeccionForm.reset();
          this.submittedContent = false;
          
          //location.reload();
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  // onContenidoSelect(contenidoId: string): void {
  //   if (contenidoId) {
  //     const selectedContenido = this.contenidoLeccion.find(c => c.id === parseInt(contenidoId));
  //     if (selectedContenido) {
  //       this.contenidoLeccionForm.patchValue({
  //         id_contenido: selectedContenido.id,
  //         titulo: selectedContenido.titulo,
  //         descripcion: selectedContenido.descripcion,
  //         id_tipo_dato: selectedContenido.id_tipo_dato,
  //         fuente_contenido: selectedContenido.fuente_contenido
  //       });

  //       // Si tienes un campo para mostrar el nombre del archivo seleccionado
  //       //this.selectedfuenteContenido = { name: selectedContenido.fuente_contenido.split('/').pop() };

  //       // Actualizar la vista del formulario
  //       this.contenidoLeccionForm.get('id_tipo_dato').updateValueAndValidity();
  //       this.contenidoLeccionForm.get('id_tipo_dato').markAsTouched();
  //     }
  //   } else {
  //     // Limpiar el formulario si no se selecciona ningún contenido
  //     this.contenidoLeccionForm.reset({
  //       id_leccion: this.contenidoLeccionForm.get('id_leccion').value
  //     });
  //     this.selectedfuenteContenido = null;
  //   }
  // }
  // onContenidoSelect(contenidoId: string): void {
  //   const currentIdLeccion = this.contenidoLeccionForm.get('id_leccion').value;
  //   if (contenidoId && contenidoId !== '') {
  //     const selectedContenido = this.contenidoLeccion.find(c => c.id === parseInt(contenidoId));
  //     if (selectedContenido) {
  //       this.contenidoLeccionForm.patchValue({
  //         id_leccion: selectedContenido.id_leccion,
  //         id_contenido: selectedContenido.id,
  //         titulo: selectedContenido.titulo,
  //         descripcion: selectedContenido.descripcion,
  //         id_tipo_dato: selectedContenido.id_tipo_dato,
  //         fuente_contenido: selectedContenido.fuente_contenido
  //       });
  //       this.contenidoLeccionForm.get('fuente_contenido').enable();
  //       console.log('Fuente de contenido seleccionada:', selectedContenido.fuente_contenido);
  //     }
  //   } else {
  //     this.contenidoLeccionForm.reset({
  //       id_leccion: currentIdLeccion, // Mantener el id_leccion actual
  //       id_contenido: null,
  //       titulo: '',
  //       descripcion: '',
  //       id_tipo_dato: '',
  //       fuente_contenido: ''
  //     });
  //   //this.selectedfuenteContenido = null;
  //   }
  //   console.log('id_leccion después de seleccionar contenido:', this.contenidoLeccionForm.get('id_leccion').value);

  // }
  // onContenidoSelect(contenidoId: string): void {
  //   // Guardar el id_leccion actual antes de cualquier cambio
  //   const currentIdLeccion = this.leccionForm.get('id_leccion').value;

  //   if (contenidoId && contenidoId !== '') {
  //     const selectedContenido = this.contenidoLeccion.find(c => c.id === parseInt(contenidoId));
  //     if (selectedContenido) {
  //       this.contenidoLeccionForm.patchValue({
  //         id_leccion: currentIdLeccion, // Usar el id_leccion del formulario de lección
  //         id_contenido: selectedContenido.id.toString(),
  //         titulo: selectedContenido.titulo,
  //         descripcion: selectedContenido.descripcion,
  //         id_tipo_dato: selectedContenido.id_tipo_dato,
  //         fuente_contenido: selectedContenido.fuente_contenido
  //       });
  //     }
  //   } else {
  //     // Si se selecciona "Agregar un contenido Nuevo"
  //     this.contenidoLeccionForm.reset({
  //       id_leccion: currentIdLeccion, // Mantener el id_leccion actual
  //       id_contenido: null,
  //       titulo: '',
  //       descripcion: '',
  //       id_tipo_dato: '',
  //       fuente_contenido: ''
  //     });
  //   }
  //   console.log('id_leccion después de seleccionar contenido:', this.contenidoLeccionForm.get('id_leccion').value);
  // }
  onContenidoSelect(contenidoId: string): void {
    const currentIdLeccion = this.contenidoLeccionForm.get('id_leccion').value;
  
    if (contenidoId === 'nuevo') {
      // Si se selecciona "Agregar contenido nuevo"
      this.contenidoLeccionForm.patchValue({
        id_leccion: currentIdLeccion,
        id_contenido: 'nuevo',
        titulo: '',
        descripcion: '',
        id_tipo_dato: '',
        fuente_contenido: ''
      });
    } else if (contenidoId) {
      const selectedContenido = this.contenidoLeccion.find(c => c.id.toString() === contenidoId);
      if (selectedContenido) {
        this.contenidoLeccionForm.patchValue({
          id_leccion: currentIdLeccion,
          id_contenido: selectedContenido.id.toString(),
          titulo: selectedContenido.titulo,
          descripcion: selectedContenido.descripcion,
          id_tipo_dato: selectedContenido.id_tipo_dato,
          fuente_contenido: selectedContenido.fuente_contenido
        });
      }
    }
  }

  getTipoDatoNombre(id: string): string {
    const tipoDato = this.listarTipoDatoContenido.find(t => t.id === +id);
    return tipoDato ? tipoDato.fuente_contenido : '';
  }



  ///////////////////////////////////////////////////////////////////////////////

  onTipoDatoChange(): void {
    this.resetFuenteField();
    this.actividadForm.get('fuente').setValidators([Validators.required]); // Siempre requerir fuente
    this.actividadForm.get('fuente').updateValueAndValidity();
  }

  onTextInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.actividadForm.patchValue({ fuente: value });
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  onFileSelecteds(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const maxSize = 5 * 1024 * 1024; // Tamaño máximo para imágenes

      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
        this.alertServices.errorAlert('Error', `El archivo es demasiado grande. El tamaño máximo permitido es ${maxSizeMB} MB.`);
        this.resetFileField('fuente');
        event.target.value = '';
        return;
      }

      this.selectedfuente = file;
      this.actividadForm.patchValue({ fuente: file });
    } else {
      this.resetFileField('fuente');
    }
  }
  resetFileField(field: string) {
    this.actividadForm.patchValue({ fuente: null });
    this.selectedfuente = null;
    this.fuentePreview = null;
  }
  resetFuenteField(): void {
    this.actividadForm.patchValue({ fuente: '' });
    this.selectedfuente = null;
    this.fuentePreview = null;
  }

  ////////////////////////////////////////////////////////////////////////////////////////

  // onTipoDatoChangeContenido(): void {
  //   const tipoDatoIdContenido = this.contenidoLeccionForm.get('id_tipo_dato').value;
  //   this.resetFuenteFieldContenido();
  //   this.contenidoLeccionForm.get('fuente_contenido').clearValidators();

  //   const tipoDatoIdnumber = Number(tipoDatoIdContenido);
  //   switch (tipoDatoIdnumber) {
  //     case 1: // Video
  //     case 2: // Imagen
  //     case 3: // PDF
  //     case 4: // Texto
  //       this.contenidoLeccionForm.get('fuente_contenido').setValidators([Validators.required]);
  //       break;
  //     default:
  //       // Si no es ninguno de los anteriores, elimina cualquier validador
  //       this.contenidoLeccionForm.get('fuente_contenido').clearValidators();
  //       break;
  //   }
  //   this.contenidoLeccionForm.get('fuente_contenido').updateValueAndValidity();
  // }

  onTipoDatoChangeContenido(): void {
    const tipoDatoIdContenido = this.contenidoLeccionForm.get('id_tipo_dato').value;
    this.resetFuenteFieldContenido();
    this.contenidoLeccionForm.get('fuente_contenido').clearValidators();

    // Resetear todos los flags de visibilidad
    // this.showVideo = false;
    // this.showImagen = false;
    // this.showPdf = false;
    // this.showTexto = false;

    const tipoDatoIdnumber = Number(tipoDatoIdContenido);
    switch (tipoDatoIdnumber) {
      case 1: // Video
      // this.showVideo = true;
      // this.contenidoLeccionForm.get('fuente_contenido').setValidators([Validators.required]);
      // break;
      case 2: // Imagen
      // this.showImagen = true;
      // this.contenidoLeccionForm.get('fuente_contenido').setValidators([Validators.required]);
      // break;
      case 3: // PDF
      // this.showPdf = true;
      // this.contenidoLeccionForm.get('fuente_contenido').setValidators([Validators.required]);
      // break;
      case 4: // Texto
      // this.showTexto = true;
      // this.contenidoLeccionForm.get('fuente_contenido').setValidators([Validators.required]);
      // break;
      default:
        // Si no es ninguno de los anteriores, elimina cualquier validador
        this.contenidoLeccionForm.get('fuente_contenido').clearValidators();
        break;
    }
    this.contenidoLeccionForm.get('fuente_contenido').updateValueAndValidity();

    // Forzar la detección de cambios
    this.cdRef.detectChanges();
  }

  onTextInputContenido(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.contenidoLeccionForm.patchValue({ fuente_contenido: value });
    //console.log('fuente actualizada:', value);  // Para depuración
  }

  triggerFileInputContenido() {
    this.fileInputs.nativeElement.click();
  }

  onFileSelectedsContenido(event: any, field: string) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      let maxSize = 0;
      if (field === 'fuente_contenido') {
        maxSize = 5 * 1024 * 1024; // Tamaño máximo para imágenes
      } else if (field === 'fuente_documentos') {
        maxSize = 18 * 1024 * 1024;
      }

      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
        this.alertServices.errorAlert('Error', `El archivo es demasiado grande. El tamaño máximo permitido es ${maxSizeMB} MB.`)
        this.resetFileField(field);
        event.target.value = '';
        return;
      }
      if (field === 'fuente_contenido' || field === 'fuente_documentos') {
        this.selectedfuenteContenido = file;
        this.contenidoLeccionForm.patchValue({ fuente_contenido: file });

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fuentePreviewContenido = e.target.result;  // Guarda la vista previa
        };
        reader.readAsDataURL(file);
      }
    } else {
      this.resetFileField(field);
    }
  }

  resetFileFieldContenido(field: string) {
    if (field === 'fuente_contenido') {
      this.contenidoLeccionForm.patchValue({ fuente_contenido: null });
      this.selectedfuenteContenido = null;
      this.fuentePreviewContenido = null;
    }
  }

  resetFuenteFieldContenido(): void {
    this.contenidoLeccionForm.patchValue({ fuente_contenido: '' });
    this.selectedfuenteContenido = null;
    this.fuentePreviewContenido = null;
  }

  ////////////////////////////////////////////////////////////////////////

}
