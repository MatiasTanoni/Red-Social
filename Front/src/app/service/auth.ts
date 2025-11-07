import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environments } from '../environments/environment';
import { firstValueFrom } from 'rxjs';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = environments.apiUrl + '/auth';
  user = signal<any | boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  async register(formData: FormData): Promise<{ success: boolean, message: string }> {
    console.log('AUTH SERVICE REGISTER', formData);
    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean, message: string }>(`${this.apiUrl}/register`, formData)
      );
      if (response.success) {
        this.user.set(true);
        console.log('USUARIO REGISTRADO:', this.user());
      }
      console.log('RESPUESTA DEL BACK:', response);
      return response;
    } catch (error) {
      this.user.set(false);
      console.error('ERROR EN REGISTRO:', error);
      throw error;
    }
  }

  getUser(): any | boolean {
    return this.user();
  }

  async login(usernameOrEmail: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = this.http.post<any>(`${this.apiUrl}/login`, { usernameOrEmail, password });
      const user = await firstValueFrom(response);
      // Podés guardar el user si querés, pero sin navegar todavía
      this.user.set(user);
      this.user.set(true);
      console.log('USUARIO LOGUEADO:', this.user());
      return { success: true, message: 'Login exitoso' };
    } catch (error: any) {
      this.user.set(false);
      const errorMessage = error?.error?.message || 'Ocurrió un error inesperado';
      console.error('Error en AuthService.login:', errorMessage);
      return { success: false, message: errorMessage };
    }
  }

  logout(): void {
    localStorage.clear();
    this.user.set(false);
    // this.currentUser.set(null);
    this.router.navigate(['/auth']);
  }
}
