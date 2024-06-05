import { Component } from '@angular/core';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../../header/header.component';
import { AddEmpresaService } from '../../servicios/add-empresa.service';
import { FormBuilder,ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Empresa } from '../../Modelos/empresa.model';
import { DepartamentoService } from '../../servicios/departamento.service';
import { MunicipioService } from '../../servicios/municipio.service';
import { User } from '../../Modelos/user.model';

@Component({
  selector: 'app-add-empresa',
  templateUrl: './add-empresa.component.html',
  styleUrl: './add-empresa.component.css',
  providers: [HeaderComponent,AddEmpresaService, DepartamentoService, MunicipioService] 
})

export class AddEmpresaComponent{
  faGlobe = faGlobe;
  faCircleQuestion = faCircleQuestion;
  addEmpresaForm:FormGroup;
  listDepartamentos: any[] = [];
  listMunicipios: any[] = [];
  departamentoPredeterminado = '';
  submitted = false;
  token = '';
  user: User | null = null;
  currentRolId: string | null = null;
 


  constructor(
    private fb:FormBuilder,
    private router:Router,
    private addEmpresaService:AddEmpresaService,
    private departamentoService: DepartamentoService,
    private municipioService: MunicipioService,
  ){
    this.addEmpresaForm = this.fb.group({
      nombre: ['', Validators.required],
      documento: ['', Validators.required],
      nombretipodoc: ['', Validators.required],
      municipio: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      cargo: ['', Validators.required],
      razonSocial: ['', Validators.required],
      url_pagina: [''],
      telefono: ['', Validators.required],
      celular: ['', Validators.required],
      direccion: ['', Validators.required],
      profesion: ['', Validators.required],
      experiencia: [''],
      funciones: ['']
    });
  }

  ngOnInit(): void {
    this.validateToken();
    
      this.cargarDepartamentos();
      
  }

  validateToken(): void {
    if (!this.token) {
        this.token = localStorage.getItem("token");
        let identityJSON = localStorage.getItem('identity');

        if (identityJSON) {
            let identity = JSON.parse(identityJSON);
            console.log(identity);
            this.user = identity;
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

    const empresa = new Empresa(
      this.f.documento.value,
      this.f.nombre.value,
      this.f.correo.value,
      this.f.cargo.value,
      this.f.razonSocial.value,
      this.f.url_pagina.value,
      this.f.telefono.value,
      this.f.celular.value,
      this.f.direccion.value,
      this.f.profesion.value,
      this.f.experiencia.value,
      this.f.funciones.value,
      this.f.nombretipodoc.value,
      this.f.municipio.value,
      this.user.id
    );
    console.log(empresa);
    this.addEmpresaService.addEmpresa(this.token,empresa).subscribe(
      (response:any) => {
        console.log(response);
        this.router.navigate(['/add-empresa']);
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
