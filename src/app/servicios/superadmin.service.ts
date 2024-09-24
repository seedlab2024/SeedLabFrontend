


import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of, shareReplay, tap } from 'rxjs';

import { environment } from '../../environment/env';

import { Superadmin } from '../Modelos/superadmin.model';
import { Personalizaciones } from '../Modelos/personalizaciones.model';
import { Actividad } from '../Modelos/actividad.model';
import { Nivel } from '../Modelos/nivel.model';
import { Leccion } from '../Modelos/leccion.model';
import { Contenido_Leccion } from '../Modelos/contenido-leccion.model';
import { access } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class SuperadminService {


  url = environment.apiUrl + 'superadmin/';

  constructor(private http: HttpClient) { }

  

  private CreacionHeaders(access_token: any): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
  }

  private CreacionHeaderss(access_token: any): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
  }

  createSuperadmin(access_token: any, formData: FormData,): Observable<any> {
    const options = { headers: this.CreacionHeaderss(access_token) };
    return this.http.post(this.url + "crearSuperAdmin", formData, options);
  }

  updateAdmin(access_token: any, idSuperadmin: number, formData: FormData): Observable<any> {
    const options = { headers: this.CreacionHeaderss(access_token) };
    return this.http.post(this.url + "editarAdmin/" + idSuperadmin, formData, options);
  }

  getInfoAdmin(access_token: any, id: number): Observable<any> {
    const options = { headers: this.CreacionHeaders(access_token) };
    return this.http.get<any>(this.url + "userProfileAdmin/" + id, options);
  }

  getAdmins(access_token: any, estado: boolean): Observable<any> {
    const options = {
      headers: this.CreacionHeaders(access_token),
      params: new HttpParams().set('estado', estado)
    };
    return this.http.get<any>(this.url + "mostrarSuperAdmins", options);
  }

  getsuperadmin(access_token: any, adminId: number): Observable<any> {
    const options = { headers: this.CreacionHeaders(access_token) };
    return this.http.get<any>(this.url + "userProfileAdmin/" + adminId, options);
  }

  asesorConAliado(access_token: any): Observable<any> {
    const options = { headers: this.CreacionHeaders(access_token) };
    return this.http.get(this.url + "asesor-aliado", options)
  }

  listarAliado(access_token: any): Observable<any> {
    const options = { headers: this.CreacionHeaders(access_token) };
    return this.http.get(this.url + "listAliado", options)
  }

  crearActividadSuperAdmin(access_token: any, formData: FormData): Observable<any> {
    const options = { headers: this.CreacionHeaderss(access_token) };
    return this.http.post(environment.apiUrl + "actividad/crearActividad", formData, options)
  }
  crearNivelSuperAdmin(access_token: any, nivel: Nivel): Observable<any> {
    const options = { headers: this.CreacionHeaders(access_token) };
    return this.http.post(environment.apiUrl + "nivel/crearNivel", nivel, options)
    //return this.http.post(this.url+"nivel",nivel,options) 
  }

  crearLeccionSuperAdmin(access_token: any, leccion: Leccion): Observable<any> {
    const options = { headers: this.CreacionHeaders(access_token) };
    return this.http.post(environment.apiUrl + "leccion/crearLeccion", leccion, options)
  }

  crearContenicoLeccionSuperAdmin(access_token: string, formData: FormData): Observable<any> {
    const options = { headers: this.CreacionHeaderss(access_token) };
    return this.http.post(environment.apiUrl + "contenido_por_leccion/crearContenidoPorLeccion", formData, options)
  }


  createPersonalizacion(access_token: any, formData: FormData, id): Observable<any> {
    const options = { headers: this.CreacionHeaderss(access_token) };
    return this.http.post(this.url + "personalizacion/" + id, formData, options);
  }

  getPersonalizacion(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + "traerPersonalizacion/"+id);
  }

  restorePersonalization(access_token: any, id): Observable<any> {
    const options = { headers: this.CreacionHeaders(access_token) };
    return this.http.post(this.url + "restaurarPersonalizacion/" + id, {}, options);
  }






  //////////////////////////
  pdfEmpenrededorMunicipio(access_token: any): Observable<any> {
    const options = { headers: this.CreacionHeaders(access_token) };
    return this.http.get(this.url + "reporte-emprendedores", options)
  }

}
