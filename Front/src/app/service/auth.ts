import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment.prod';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = environment.apiUrl + '/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  register(formData: FormData) {
    return this.http.post<any>(this.apiUrl + '/register', formData);
  }

  async login(usernameOrEmail: string, password: string): Promise<any> {
    try {
      const response = this.http.post<any>(`${this.apiUrl}/login`, { usernameOrEmail, password });
      const user = await firstValueFrom(response);
      // this.saveUserToLocalStorage(user);
      // this.currentUser.set(user);
      await this.router.navigate(['/plubications']);
      return user;
    } catch (error: any) {
      const errorMessage = error?.error?.message || 'Ocurrió un error inesperado';
      console.error('Error en AuthService.login:', errorMessage);
      throw errorMessage;
    }
  }
}
