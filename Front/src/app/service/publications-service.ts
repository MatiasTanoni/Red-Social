import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/publicaciones'; // Cambiá tu endpoint

  constructor(private http: HttpClient) { }

  getPublications(page: number, orderBy: 'fecha' | 'likes'): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.apiUrl}?page=${page}&orderBy=${orderBy}`);
  }

  toggleLike(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/like`, {});
  }

  deletePublication(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
