import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../environment/env';

import { Ruta } from '../Modelos/ruta.modelo';

@Injectable({
  providedIn: 'root'
})
export class RutaService {

  url = environment.apiUrl + 'ruta';

  constructor(private http:HttpClient) { }

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

  getAllRutas(access_token:any, estado: boolean): Observable<any>{
    const options = { headers: this.CreacionHeaders(access_token),
      params: new HttpParams().set('estado', estado) };
    return this.http.get(this.url+'/ruta', options);
  }

  descargarArchivo(contenidoId: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${environment.apiUrl}descargar-archivo/${contenidoId}`, {
      observe: 'response',
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }

  ultimaActividad(access_token:any, rutaId: number):Observable<any>{
    const options= { headers: this.CreacionHeaders(access_token)};
    const url = `${environment.apiUrl}ultimaruta/${rutaId}`;
    return this.http.get(url, options);
  }

  //Pendiente por revisar si se borra
  // rutasActivas(access_token:any): Observable<any>{
  //   const options = { headers: this.CreacionHeaders(access_token) };
  //   return this.http.get(this.url+'/rutasActivas',options)
  // }

  createRutas(access_token:any, ruta:Ruta): Observable<any>{
    const options = { headers: this.CreacionHeaders(access_token) };
    return this.http.post(this.url+'/ruta', ruta,options);
  }
  
  rutaXid(access_token:any, rutaId: number):Observable<any>{
    const options= { headers: this.CreacionHeaders(access_token)};
    return this.http.get(this.url+'/rutaXid/'+rutaId, options);
  }
  
  //Pendiente revisar
  // contenidoRuta(access_token:any, idRuta: number):Observable<any>{
  //   const options= { headers: this.CreacionHeaders(access_token)};
  //   return this.http.get(this.url+'/mostrarRutaContenido/'+idRuta,options);
  // }  

  actnivleccontXruta(access_token:any, idRuta: number, estado:any):Observable<any>{
    const options = { headers: this.CreacionHeaders(access_token),
      params: new HttpParams().set('estado', estado)
    };
    return this.http.get<{id: number, actividades: any[]}>(this.url + '/actnivleccontXruta/' + idRuta, options);

  }

  activadadxAliado(access_token:any, idRuta: number, idAliado, estado:any):Observable<any>{
    const options = { headers: this.CreacionHeaders(access_token),
      params: new HttpParams().set('estado', estado)
    };
    return this.http.get<{id: number, actividades: any[]}>(this.url + '/actnividadxAliado/'+idRuta+'/'+idAliado, options);
  }

  activadadxAsesor(access_token:any, idRuta: number, idAsesor, estado:any):Observable<any>{
    const options = { headers: this.CreacionHeaders(access_token),
      params: new HttpParams().set('estado', estado)
    };
    return this.http.get(this.url+'/actnividadxNivelAsesor/'+idRuta+'/'+idAsesor,options)
  }

  actividadCompletaxruta(access_token:any, idRuta: number):Observable<any>{
    const options = { headers: this.CreacionHeaders(access_token)};
    return this.http.get(this.url+'/actividadcompleta/'+idRuta,options)
  }

  ruta(access_token:any):Observable<any>{
    const options = { headers: this.CreacionHeaders(access_token)};
    return this.http.get(this.url+'/rutas',options)
  }

  rutasmejorado(access_token:any):Observable<any>{
    const options = { headers: this.CreacionHeaders(access_token)};
    return this.http.get(this.url+'/rutasmejorado',options)
  }
  
  updateRutas(access_token:any, ruta:Ruta,id:number):Observable<any>{
    const options= { headers: this.CreacionHeaderss(access_token)};
    return this.http.put(this.url+'/ruta/'+id,ruta,options);
  }

  updateNivel(access_token:any,id:number,nivel:any):Observable<any>{
    const options = { headers: this.CreacionHeaders(access_token)};
    return this.http.put(this.url+'/editar_nivel/'+id,nivel,options)
  }

  updateLeccion(access_token:any):Observable<any>{
    const options = { headers: this.CreacionHeaders(access_token)};
    return this.http.put(this.url+'leccion',options)
  }

  updateContenidoLecciones(access_token:any):Observable<any>{
    const options = { headers: this.CreacionHeaders(access_token)};
    return this.http.put(this.url+'contenido_por_leccion',options)
  }

  idRespuestas(access_token:any, id_emprendedor:string):Observable<any>{
    const options = { headers: this.CreacionHeaders(access_token)};
    return this.http.get(this.url+'/idRespuestasHeidy/'+id_emprendedor,options)
  }

}
