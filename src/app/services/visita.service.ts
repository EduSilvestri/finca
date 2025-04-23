import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visita } from '../interface/visita.interface';

@Injectable({
  providedIn: 'root'
})
export class VisitaService {
  private apiUrl = 'http://localhost/backend/public/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiUrl}/visitas`, {
      headers: this.getHeaders()
    });
  }

  crearVisita(data: Visita): Observable<Visita> {
    return this.http.post<Visita>(`${this.apiUrl}/visitas`, data, {
      headers: this.getHeaders()
    });
  }

  eliminarVisita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/visitas/${id}`, {
      headers: this.getHeaders()
    });
  }

  actualizarVisita(id: number, data: Visita): Observable<Visita> {
    return this.http.put<Visita>(`${this.apiUrl}/visitas/${id}`, data, {
      headers: this.getHeaders()
    });
  }

  
}
