import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GitHubSearchResponse, SearchParams } from '../models/github.models';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly http = inject(HttpClient);

  searchRepositories(params: SearchParams): Observable<GitHubSearchResponse> {
    let httpParams = new HttpParams().set('q', params.q);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.order) httpParams = httpParams.set('order', params.order);
    httpParams = httpParams.set('per_page', String(params.per_page ?? 10));
    httpParams = httpParams.set('page', String(params.page ?? 1));

    return this.http.get<GitHubSearchResponse>('/api/search', { params: httpParams });
  }
}
