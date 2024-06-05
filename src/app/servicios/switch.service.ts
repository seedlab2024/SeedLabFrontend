import { EventEmitter, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SwitchService {

  constructor() { }
  $modal = new EventEmitter<any>();

  $modalCrearOrientador = new EventEmitter<any>();

  $modalCrearSuperadmin = new EventEmitter<any>();
}
