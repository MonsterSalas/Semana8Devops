import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer b29f5449-8053-4749-9cd0-3ca7ca04309a'
    })
  };

  private jsonUrl = 'https://firebasestorage.googleapis.com/v0/b/json-20921.appspot.com/o/personas.json?alt=media&token=b29f5449-8053-4749-9cd0-3ca7ca04309a';

  private lista: any;

  constructor(private http: HttpClient) { }

  getJsonData(): Observable<any> {
    return this.http.get(this.jsonUrl);
  }

  MetodoPersona(listaPersonas: any) {
    console.log(listaPersonas);
    this.http.post(this.jsonUrl, listaPersonas, this.httpOptions).subscribe(
      response => {
        console.log('Archivo JSON sobreescrito con éxito', response);
      },
      error => {
        console.log('Error al sobreescribir archivo JSON', error);
      })
  }
}


