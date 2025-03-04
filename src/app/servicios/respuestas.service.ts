import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/env';
import { Respuesta } from '../Modelos/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class RespuestasService {

  url = environment.apiUrl + 'respuestas';

  constructor(private http: HttpClient) { }

  /* Guarda las respuestas del usuario en el servidor */
  saveAnswers(access_token: any, payload: { respuestas: Respuesta[] }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    return this.http.post(this.url + '/guardar-respuestas', payload, { headers });
  }

  /* Guarda las respuestas de una sección específica en Redis */
  saveAnswersSection(access_token: string, id_empresa: number, sectionId: number, vez: number, respuestas: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    });
    // Empaqueta las respuestas en un objeto
    const payload = { respuestas: respuestas };
    // Nota: se agrega "vez" al final de la URL, ya que el backend espera /form/section/{id_empresa}/{sectionId}/{vez}
    return this.http.post(`${this.url}/form/section/${id_empresa}/${sectionId}/${vez}`, JSON.stringify(payload), { headers });
  }


  /* Obtiene las respuestas almacenadas en Redis para una empresa específica */
  getAnwerFromDb(access_token: string, id_empresa: number, vez: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    return this.http.get(`${this.url}/getAllRespuestasFromDB/${id_empresa}/${vez}`, { headers });
  }

  /* Verifica el estado del formulario para una empresa específica */
  verificarEstadoForm(access_token: string, id_empresa: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    return this.http.get(this.url + '/verificarEstadoForm/' + id_empresa, { headers });
  }
}