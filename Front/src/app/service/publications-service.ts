import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Publication {
  _id: number;
  username: string;
  content: string;
  date: Date;
  likes: Array<string>;
  iLike: boolean;
  image_url : string;
}

@Injectable({ providedIn: 'root' })
export class PublicationsService {
  private apiUrl = environment.apiUrl + '/posts';

  constructor(private http: HttpClient) { }

  getPublications(page: number, orderBy: 'fecha' | 'likes', limit = 3) {
    return this.http.get<Publication[]>(
      `${this.apiUrl}/all?page=${page}&orderBy=${orderBy}&limit=${limit}`
    );
  }

  getPostsByUser(userId: string) {
    console.log("🔵 Obteniendo publicaciones para el usuario con ID:", userId);
    return this.http.get<Publication[]>(`${this.apiUrl}/user/${userId}`);
  }


  createPost(data: {
    idUser: string;
    firstName: string;
    lastName: string;
    username: string;
    content: string;
    image_url: string;
  }): Observable<any> {
    try {
      console.log("🔴 Enviando createPost con data:", data);

      return this.http.post<any>(`${this.apiUrl}/createPost`, data);
    } catch (error) {
      console.error("🔴 Error al enviar createPost:", error);
      throw error;
    }
  }

  toggleLike(id: number, idUser: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/like`, { id, idUser });
  }

  deletePublication(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}