import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { EmprendedorService } from '../../servicios/emprendedor.service';
import { Empresa } from '../../Modelos/empresa.model';
import { Router } from '@angular/router';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-list-empresas',
  providers: [EmprendedorService, HeaderComponent],
  templateUrl: './list-empresas.component.html',
  styleUrl: './list-empresas.component.css'
})
export class ListEmpresasComponent implements OnInit {
  faPen = faPenToSquare;
  listaEmpresas: Empresa[] = [];
  documento: string | null;
  public page!: number;

 



  constructor(private emprendedorService: EmprendedorService, private _router: Router, private aRoute: ActivatedRoute) {
    this.documento = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.cargarEmpresas();
  }


  cargarEmpresas(): void {
    this.emprendedorService.getEmpresas(this.documento).subscribe(
      data => {
        this.listaEmpresas = data;
      },
      err => {
        console.log(err);
      });
  }

}
