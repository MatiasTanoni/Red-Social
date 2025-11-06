import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environments } from '../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = environments.apiUrl + '/auth';

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
      console.log('RESPUESTA DEL BACK:', response);
      return response;
    } catch (error) {
      console.error('ERROR EN REGISTRO:', error);
      throw error;
    }
  }


  async login(usernameOrEmail: string, password: string): Promise<any> {
    try {
      const response = this.http.post<any>(`${this.apiUrl}/login`, { usernameOrEmail, password });
      const user = await firstValueFrom(response);
      // this.saveUserToLocalStorage(user);
      // this.currentUser.set(user);
      await this.router.navigate(['/plublications']);
      return user;
    } catch (error: any) {
      const errorMessage = error?.error?.message || 'Ocurrió un error inesperado';
      console.error('Error en AuthService.login:', errorMessage);
      throw errorMessage;
    }
  }
}
