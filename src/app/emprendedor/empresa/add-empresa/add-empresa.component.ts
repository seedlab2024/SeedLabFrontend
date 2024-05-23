import { Component } from '@angular/core';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../../../header/header.component';
import { AddEmpresaService } from '../../../servicios/add-empresa.service';
import { FormBuilder,ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Empresa } from '../../../Modelos/empresa.model';
import { DepartamentoService } from '../../../servicios/departamento.service';
import { MunicipioService } from '../../../servicios/municipio.service';
import { User } from '../../../Modelos/user.model';


@Component({
  selector: 'app-add-empresa',
  templateUrl: './add-empresa.component.html',
  styleUrl: './add-empresa.component.css',
  providers: [HeaderComponent,AddEmpresaService, DepartamentoService, MunicipioService] 
})

export class AddEmpresaComponent{
  faGlobe = faGlobe;
  faCircleQuestion = faCircleQuestion;
  //addEmpresaForm:FormGroup;
  listDepartamentos: any[] = [];
  listMunicipios: any[] = [];
  departamentoPredeterminado = '';
  submitted = false;
  token = '';
  documento:string;
  user: User | null = null;
  currentRolId: string | null = null;

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private addEmpresaService:AddEmpresaService,
    private departamentoService: DepartamentoService,
    private municipioService: MunicipioService,
  ){
    
  }

  ngOnInit(): void {
    this.validateToken();
    this.cargarDepartamentos();
      
  }

  addEmpresaForm = this.fb.group({
    nombre: ['', Validators.required],
    documento: ['', Validators.required],
    id_tipo_documento: ['', Validators.required],
    municipio: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    cargo: ['', Validators.required],
    razonSocial: ['', Validators.required],
    url_pagina: ['',Validators.required],
    telefono: [''],
    celular: ['', Validators.required],
    direccion: ['', Validators.required],
    profesion: ['', Validators.required],
    experiencia: ['',Validators.required],
    funciones: ['',Validators.required]
  });

  validateToken(): void {
    if (!this.token) {
        this.token = localStorage.getItem("token");
        let identityJSON = localStorage.getItem('identity');

        if (identityJSON) {
            let identity = JSON.parse(identityJSON);
            console.log(identity);
            this.user = identity;
            this.documento = this.user.emprendedor.documento;
            this.currentRolId = this.user.id_rol?.toString();
            console.log(this.currentRolId);
        }
    }
  }

  get f() { return this.addEmpresaForm.controls; }

  crearEmpresa():void {
    this.submitted = true;
    console.log("Formulario enviado", this.addEmpresaForm.value);
    if (this.addEmpresaForm.invalid) {
      console.log("Formulario inválido");
      return;
    }

    const empresa : Empresa = {
      nombre: this.addEmpresaForm.get('nombre')?.value,
      documento: this.addEmpresaForm.get('documento')?.value,
      id_tipo_documento: this.addEmpresaForm.get('id_tipo_documento')?.value,
      id_municipio: this.addEmpresaForm.get('municipio')?.value,
      correo: this.addEmpresaForm.get('correo')?.value,
      cargo: this.addEmpresaForm.get('cargo')?.value,
      razonSocial: this.addEmpresaForm.get('razonSocial')?.value,
      url_pagina: this.addEmpresaForm.get('url_pagina')?.value,
      telefono: this.addEmpresaForm.get('telefono')?.value,
      celular: this.addEmpresaForm.get('celular')?.value,
      direccion: this.addEmpresaForm.get('direccion')?.value,
      profesion: this.addEmpresaForm.get('profesion')?.value,
      experiencia: this.addEmpresaForm.get('experiencia')?.value,
      funciones: this.addEmpresaForm.get('funciones')?.value,
      id_emprendedor: this.user?.emprendedor.documento,
    }
      
    console.log(empresa);
    this.addEmpresaService.addEmpresa(this.token,empresa).subscribe(
      (response:any) => {
        console.log(response);
        this.router.navigate(['list-empresa/:documento']);
      },
      error => {
        console.log(error);
      }
    );
  }


  mostrarOcultarContenido() {
    const checkbox = document.getElementById("mostrarContenido") as HTMLInputElement;
    const contenidoDiv = document.getElementById("contenido");
    const guardar = document.getElementById("guardar");
    if (contenidoDiv && guardar) {
      contenidoDiv.style.display = checkbox.checked ? "block" : "none";
      guardar.style.display = checkbox.checked ? "none" : "block";
    }
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

  //Funcion para traer el nombre del departamento seleccionado
  onDepartamentoSeleccionado(nombreDepartamento: string): void {
    this.cargarMunicipios(nombreDepartamento);
  }

  //Funcion para cargar los municipios
  cargarMunicipios(nombreDepartamento: string): void {
    this.municipioService.getMunicipios(nombreDepartamento).subscribe(
      data => {
        this.listMunicipios = data;
      },
      err => {
        console.log('Error al cargar los municipios:', err);
      }
    );
  }

}