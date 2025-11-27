import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { strict } from 'assert';
import { Publication, Comment } from '../models/publication.model';

@Injectable({ providedIn: 'root' })
export class PublicationsService {
  private apiUrl = environment.apiUrl + '/posts';

  constructor(private http: HttpClient) { }

  getPublications(page: number, orderBy: 'fecha' | 'likes', admin: boolean, limit = 3) {
    console.log("admin", admin);
    return this.http.get<Publication[]>(
      `${this.apiUrl}/all?page=${page}&orderBy=${orderBy}&admin=${admin}&limit=${limit}`
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
    imagePost: string;
  }): Observable<any> {
    try {
      console.log("🔴 Enviando createPost con data:", data);

      return this.http.post<any>(`${this.apiUrl}/createPost`, data);
    } catch (error) {
      console.error("🔴 Error al enviar createPost:", error);
      throw error;
    }
  }

  toggleLike(id: string, idUser: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/like`, { id, idUser });
  }

  deletePublication(_id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${_id}`);
  }

  addComment(id: string, comment: any): Observable<Publication> {
    console.log("🔵 Enviando comentario:", comment);
    return this.http.post<Publication>(`${this.apiUrl}/${id}/comment`, comment);
  }

  editComment(publicationId: string, commentId: string, newText: string) {
    console.log("🔵 Enviando comentario:", commentId, newText);
    return this.http.put<Publication>(
      `${this.apiUrl}/${publicationId}/comment/${commentId}`,
      { text: newText }
    );
  }

  disable(id: string) {
    return this.http.put(`${this.apiUrl}/${id}/disable`, {});
  }
}