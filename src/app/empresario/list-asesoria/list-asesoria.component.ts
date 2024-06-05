import { Component } from '@angular/core';
import { Asesoria } from '../../Modelos/asesoria.model';
import { AsesoriaService } from '../../servicios/asesoria.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CrearAsesoriaModalComponent } from './crear-asesoria-modal/crear-asesoria-modal.component';

@Component({
  selector: 'app-list-asesoria',
  templateUrl: './list-asesoria.component.html',
  styleUrl: './list-asesoria.component.css'
})
export class ListAsesoriaComponent {
  barritaColor: string;
  token: string | null = null;
  documento: string | null;
  listaAsesorias: Asesoria[] = [];

  ngOnInit() {
    this.initDatos();
    this.validartoken();
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

/*
  constructor(private asesoriaService: AsesoriaService, 
    private router: Router, 
    private aRoute: ActivatedRoute, 
    private fb: FormBuilder,) {
    this.documento = this.aRoute.snapshot.paramMap.get('id');
  }

  Con este codigo pienso que se puede conectar, el constructor de abajo funciona para el modal de crear
*/

constructor(
  private asesoriaService: AsesoriaService,
  private router: Router,
  private aRoute: ActivatedRoute,
  private fb: FormBuilder,
  private dialog: MatDialog
) {
  this.documento = this.aRoute.snapshot.paramMap.get('id');
}

openCrearAsesoriaModal() {
  const dialogRef = this.dialog.open(CrearAsesoriaModalComponent, {
    width: '400px',
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Lógica para manejar el resultado del modal
      console.log('Asesoría creada:', result);
    }
  });
}



  cargarAsesorias(): void {
    if (this.token) {
      this.asesoriaService.getAsesorias(this.token, this.documento).subscribe(
        (data) => {
          this.listaAsesorias = data;
          this.initDatos();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  
  initDatos() {
    const contenedor = document.getElementById('contenedorp');
    if (contenedor && this.listaAsesorias) {
      this.listaAsesorias.forEach((item) => {
        const nuevaTarjeta = document.createElement('div');
        nuevaTarjeta.classList.add('relative', 'bg-white', 'rounded-lg', 'shadow-md',
          'overflow-hidden', 'w-80', 'm-4');
  
        this.barritaColor = item.asignacion === false ? 'bg-[#C5F9AD]' : 'bg-[#FFB7B7]';
  
        nuevaTarjeta.innerHTML = `
          <div class="absolute h-full w-2 ${this.barritaColor}"></div>
          <div class="p-4 border border-gray-200">
            <h2 class="text-xl font-bold mb-2">${item.nombre_sol}</h2>
            <p class="text-gray-700 mb-4">${item.fecha}</p>
            <h2 class="text-l font-semibold">${item.notas}</h2>
            <p class="text-gray-700">${item.isorientador}</p>
            <p class="text-gray-700">${item.id_aliado}</p>
            <p class="text-gray-700">${item.doc_emprendedor}</p>
          </div>
        `;
  
        contenedor.appendChild(nuevaTarjeta);
      });
    }
  }
  

  changeColor(button) {
    const buttons = document.querySelectorAll('.btn-color');
    buttons.forEach(btn => {
      btn.classList.remove('bg-gray-200');
    });
    button.classList.add('bg-gray-200');
  }
}
