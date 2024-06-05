import { Component, OnInit } from '@angular/core';
import { EmprendedorService } from '../../servicios/emprendedor.service';
import { Empresa } from '../../Modelos/empresa.model';
import { Router } from '@angular/router';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { User } from '../../Modelos/user.model';

@Component({
  selector: 'app-list-empresas',
  providers: [EmprendedorService, HeaderComponent],
  templateUrl: './list-empresas.component.html',
  styleUrl: './list-empresas.component.css'
})
export class ListEmpresasComponent implements OnInit {
  faPen = faPenToSquare;
  listaEmpresas: Empresa[] = [];
  listaUser: User[] = [];
  documento: string | null;
  public page!: number;
  token: string | null = null;



  constructor(private emprendedorService: EmprendedorService, 
    private router: Router, 
    private aRoute: ActivatedRoute, 
    private fb: FormBuilder,) {
    this.documento = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.validartoken();
    this.cargarEmpresas();
  }

  validartoken(): void {
    this.token = localStorage.getItem('token');
    this.documento = localStorage.getItem('documento');
    if (!this.token || !this.documento) {
      this.router.navigate(['/inicio/body']);
     // console.log('no lista empresa no esta tomando el token');
    }
    // console.log(localStorage.getItem('documento'));
  }

  cargarEmpresas(): void {
    if (this.token) {
      this.emprendedorService.getEmpresas(this.token, this.documento).subscribe(
        (data) => {
          this.listaEmpresas = data;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }


}
