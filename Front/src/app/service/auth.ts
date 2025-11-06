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

  register(formData: FormData) : Promise<{success: boolean, message: string}> {
    console.log('AuthService.register called with formData:', formData);
    return firstValueFrom(this.http.post<{success: boolean, message: string}>(`${this.apiUrl}/register`, formData));
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
