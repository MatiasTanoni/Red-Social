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
    return this.http.get<Publication[]>(`${this.apiUrl + '/all'}?page=${page}&orderBy=${orderBy}`);
  }

  createPost(data: any): Observable<any> {
    console.log("FORM DATA en servicio:", data);
    console.log(this.apiUrl);
    console.log(this.apiUrl + '/create');

    return this.http.post<any>(this.apiUrl + '/create', data);
  }

  toggleLike(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/like`, {});
  }

  deletePublication(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
