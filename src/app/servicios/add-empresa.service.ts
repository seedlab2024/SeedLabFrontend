import { Injectable } from '@angular/core';
import { environment } from '../../environment/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../Modelos/empresa.model';
import { ApoyoEmpresa } from '../Modelos/apoyo-empresa.modelo';


@Injectable({
  providedIn: 'root'
})
export class AddEmpresaService {

  url = environment.apiUrl + 'empresa';

  constructor(private http: HttpClient) { }

 addEmpresa(access_token: any, empresa:Empresa, apoyoEmpresa:ApoyoEmpresa = null): Observable<any> {
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const body = {empresa,apoyoEmpresa}
    return this.http.post(this.url,body,{headers});
  }
}
