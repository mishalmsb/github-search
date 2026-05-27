import { Injectable, inject } from '@angular/core';
import { REQUEST_CONTEXT } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GitHubSearchResponse, SearchParams } from '../models/github.models';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.github.com';
  private readonly ctx = inject<Record<string, unknown>>(REQUEST_CONTEXT as any, { optional: true });

  searchRepositories(params: SearchParams): Observable<GitHubSearchResponse> {
    let httpParams = new HttpParams().set('q', params.q);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.order) httpParams = httpParams.set('order', params.order);
    httpParams = httpParams.set('per_page', String(params.per_page ?? 10));
    httpParams = httpParams.set('page', String(params.page ?? 1));

    const headers: Record<string, string> = {};
    const token = this.ctx?.['GITHUB_TOKEN'] as string | undefined;
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return this.http.get<GitHubSearchResponse>(
      `${this.baseUrl}/search/repositories`,
      { params: httpParams, headers: new HttpHeaders(headers) },
    );
  }
}
