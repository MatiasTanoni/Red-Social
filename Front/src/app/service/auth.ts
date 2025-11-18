import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = environment.apiUrl + '/auth';
  user = signal<any | boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  async register(formData: FormData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean; message: string; user?: any }>(`${this.apiUrl}/register`, formData)
      );

      if (response.success && response.user) {
        this.user.set(response.user); // ✅ guardamos el usuario
        console.log('USUARIO REGISTRADO:', this.user());
      }

      console.log('USUARIO REGISTRADO:', this.user());
      return response;
    } catch (error) {
      this.user.set(false);
      console.error('ERROR EN REGISTRO:', error);
      throw error;
    }
  }

  async login(usernameOrEmail: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = this.http.post<any>(`${this.apiUrl}/login`, { usernameOrEmail, password });
      const user = await firstValueFrom(response);

      this.user.set(user); // ✅ guardamos el objeto usuario del backend
      console.log('USUARIO LOGUEADO:', this.user());
      return { success: true, message: 'Login exitoso' };
    } catch (error: any) {
      this.user.set(false);
      const errorMessage = error?.error?.message || 'Ocurrió un error inesperado';
      console.error('Error en AuthService.login:', errorMessage);
      return { success: false, message: errorMessage };
    }
  }

  logout(): Promise<{ success: boolean; message: string }> {
    localStorage.clear();
    this.user.set(false);
    this.router.navigate(['/auth']);
    return Promise.resolve({ success: true, message: 'Sesión cerrada exitosamente' });
  }

  getUser(): any | boolean {
    return this.user();
  }
}
