import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../environments/environment';

export interface Publication {
  id: number;
  author: string;
  content: string;
  date: Date;
  likes: number;
  iLike: boolean;
}

@Injectable({ providedIn: 'root' })
export class PublicationsService {
  private apiUrl = environments.apiUrl + '/posts';

  constructor(private http: HttpClient) { }

  getPublications(page: number, orderBy: 'fecha' | 'likes'): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.apiUrl}/all?page=${page}&orderBy=${orderBy}`);
  }

  createPost(data: {
    idUser: string;
    firstName: string;
    lastName: string;
    username: string;
    content: string;
  }): Observable<any> {
    try {
      console.log("🔴 Enviando createPost con data:", data);

      return this.http.post<any>(`${this.apiUrl}/createPost`, data);
    } catch (error) {
      console.error("🔴 Error al enviar createPost:", error);
      throw error;
    }
  }

  toggleLike(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/like`, {});
  }

  deletePublication(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}