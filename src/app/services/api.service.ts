import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost/backend/public/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  getAnimales(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/animals`, { headers });
  }

  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data);
  }

  postWithAuth(endpoint: string, data: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/${endpoint}`, data, { headers });
  }

  putWithAuth(endpoint: string, data: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${endpoint}`, data, { headers });
  }

  patchWithAuth(endpoint: string, data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/merge-patch+json'
    });
  
    return this.http.patch(`${this.apiUrl}/${endpoint}`, data, { headers });
  }
  
  

  deleteWithAuth(endpoint: string, token: string) {
    return this.http.delete(`${this.apiUrl}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
}

