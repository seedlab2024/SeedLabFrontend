import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AliadoService } from '../../servicios/aliado.service';
@Component({
  selector: 'app-add-aliados',
  templateUrl: './add-aliados.component.html',
  styleUrls: ['./add-aliados.component.css']
})
export class AddAliadosComponent {
  nombre: string = '';
  descripcion: string = '';
  logoUrl: string = '';
  ruta: string = '';
  tipodato: string = 'valorDelTipoDato'; // Proporciona un valor adecuado
  email: string = 'correo@example.com'; // Proporciona un correo válido
  password: string = 'contraseñaSegura'; // Proporciona una contraseña válida
  estado: number = 1; // Proporciona un estado válido
  token: string | null = localStorage.getItem('token'); // Almacenar el token

  constructor(private aliadoService: AliadoService, private router: Router) {}

  ngOnInit(): void {
    if (!this.token) {
      console.error('Token no disponible.');
      return;
    }

    // Implementar cualquier lógica adicional que necesites en el onInit
  }

  onSubmit(): void {
    if (!this.token) {
      console.error('Token no disponible.');
      return;
    }

    const aliado = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      logo: this.logoUrl,
      ruta: this.ruta,
      tipodato: this.tipodato,
      email: this.email,
      password: this.password,
      estado: this.estado
    };

    this.aliadoService.crearAliado(aliado, this.token).subscribe({
      next: (response) => {
        alert('Creación exitosa');
        this.router.navigate(['list-aliados']);
      },
      error: (error) => {
        console.error('Error en la creación del aliado:', error);
        alert(`Error: ${error.message}`);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
