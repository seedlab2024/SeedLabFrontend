import { Component } from '@angular/core';

import { fa1 } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-encuesta-empresa',
  templateUrl: './encuesta-empresa.component.html',
  styleUrls: ['./encuesta-empresa.component.css'],
})
export class EncuestaEmpresaComponent {
  fa1 = fa1;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  selectedOption1: string = '';
  selectedOption2: string = '';
  selectedOption3: string = '';
  selectedOption4: string = '';
  selectedOption5: string = '';

  mostrarSeccion1() {
    var seccion1 = document.getElementById('seccion1');
    var seccion2 = document.getElementById('seccion2');
    var seccion3 = document.getElementById('seccion3');
    var seccion4 = document.getElementById('seccion4');

    seccion1.style.display = 'block';
    seccion2.style.display = 'none';
    seccion3.style.display = 'none'; 
    seccion4.style.display = 'none'; 
  }

  mostrarSeccion2() {
    var seccion1 = document.getElementById('seccion1');
    var seccion2 = document.getElementById('seccion2');
    var seccion3 = document.getElementById('seccion3');
    var seccion4 = document.getElementById('seccion4');

    seccion1.style.display = 'none';
    seccion2.style.display = 'block';
    seccion3.style.display = 'none'; 
    seccion4.style.display = 'none'; 
  }

  mostrarSeccion3() {
    var seccion1 = document.getElementById('seccion1');
    var seccion2 = document.getElementById('seccion2');
    var seccion3 = document.getElementById('seccion3');
    var seccion4 = document.getElementById('seccion4');

    seccion1.style.display = 'none';
    seccion2.style.display = 'none';
    seccion3.style.display = 'block'; 
    seccion4.style.display = 'none'; 
  }

  mostrarSeccion4() {
    var seccion1 = document.getElementById('seccion1');
    var seccion2 = document.getElementById('seccion2');
    var seccion3 = document.getElementById('seccion3');
    var seccion4 = document.getElementById('seccion4');

    seccion1.style.display = 'none';
    seccion2.style.display = 'none';
    seccion3.style.display = 'none'; 
    seccion4.style.display = 'block'; 
  }
}