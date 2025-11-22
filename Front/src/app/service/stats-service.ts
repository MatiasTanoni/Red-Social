import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostsPerUser, CommentsCount, CommentsPerPost } from '../models/stats.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(private http: HttpClient) { }
  private url = environment.apiUrl + '/stats';

  getPostsPerUser(from: string, to: string) {
    return this.http.get<PostsPerUser[]>(`${this.url}/posts-per-user?from=${from}&to=${to}`);
  }

  getCommentsCount(from: string, to: string) {
    return this.http.get<CommentsCount>(`${this.url}/comments-count?from=${from}&to=${to}`);
  }

  getCommentsPerPost(from: string, to: string) {
    return this.http.get<CommentsPerPost[]>(`${this.url}/comments-per-post?from=${from}&to=${to}`);
  }

}

