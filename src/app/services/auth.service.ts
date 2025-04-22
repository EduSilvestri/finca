import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost/backend/public/api';
  private tokenKey = 'token';

  private _user = signal<any>(null);
  user = computed(() => this._user());

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this._user.set(JSON.parse(storedUser));
    }
  }

  login(credentials: { email: string, password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this._user.set(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
    this._user.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  

  getUser(): any {
    return this._user();
  }

  isAdmin(): boolean {
    const user = this._user();
    return user?.roles?.includes('ROLE_ADMIN');
  }

  getUserId(): number | null {
    return this._user()?.id || null;
  }

}
