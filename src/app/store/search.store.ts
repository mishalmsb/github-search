import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { forkJoin, of, pipe } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { GitHubRepo, OrderOption, SortOption } from '../models/github.models';
import { GithubService } from '../services/github.service';

export interface SearchState {
  repos: GitHubRepo[];
  totalCount: number;
  loadedMaxPage: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  currentQuery: string;
  sort: SortOption;
  order: OrderOption;
  perPage: number;
}

const initialState: SearchState = {
  repos: [],
  totalCount: 0,
  loadedMaxPage: 0,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  currentQuery: '',
  sort: 'stars',
  order: 'desc',
  perPage: 10,
};

export interface LoadParams {
  query: string;
  page: number;
  sort: SortOption;
  order: OrderOption;
  perPage: number;
}

export const SearchStore = signalStore(
  withState(initialState),

  withComputed((store) => ({
    hasMore: computed(
      () =>
        store.repos().length > 0 &&
        store.repos().length < store.totalCount() &&
        store.loadedMaxPage() < 10,
    ),

    isEmpty: computed(
      () =>
        !store.isLoading() &&
        store.repos().length === 0 &&
        store.currentQuery() !== '',
    ),

    resultPages: computed(() => {
      const repos = store.repos();
      const perPage = store.perPage();
      const pages: { page: number; repos: GitHubRepo[] }[] = [];
      for (let i = 0; i < repos.length; i += perPage) {
        pages.push({
          page: Math.floor(i / perPage) + 1,
          repos: repos.slice(i, i + perPage),
        });
      }
      return pages;
    }),
  })),

  withMethods((store, githubService = inject(GithubService)) => {
    const loadSinglePage = rxMethod<LoadParams>(
      pipe(
        tap(({ query, sort, order, perPage }) =>
          patchState(store, {
            isLoading: true,
            error: null,
            currentQuery: query,
            sort,
            order,
            perPage,
            repos: [],
            totalCount: 0,
            loadedMaxPage: 0,
          }),
        ),
        switchMap(({ query, page, sort, order, perPage }) =>
          githubService
            .searchRepositories({ q: query, sort, order, per_page: perPage, page })
            .pipe(
              tap((res) =>
                patchState(store, {
                  repos: res.items,
                  totalCount: res.total_count,
                  loadedMaxPage: page,
                  isLoading: false,
                }),
              ),
              catchError(() => {
                patchState(store, {
                  error:
                    'Failed to fetch repositories. GitHub API rate limit may have been reached.',
                  isLoading: false,
                });
                return of(null);
              }),
            ),
        ),
      ),
    );

    const loadPagesUpTo = rxMethod<LoadParams>(
      pipe(
        tap(({ query, sort, order, perPage }) =>
          patchState(store, {
            isLoading: true,
            error: null,
            currentQuery: query,
            sort,
            order,
            perPage,
            repos: [],
            totalCount: 0,
            loadedMaxPage: 0,
          }),
        ),
        switchMap(({ query, page, sort, order, perPage }) => {
          const requests = Array.from({ length: page }, (_, i) =>
            githubService.searchRepositories({
              q: query,
              sort,
              order,
              per_page: perPage,
              page: i + 1,
            }),
          );
          return forkJoin(requests).pipe(
            tap((responses) =>
              patchState(store, {
                repos: responses.flatMap((r) => r.items),
                totalCount: responses[0].total_count,
                loadedMaxPage: page,
                isLoading: false,
              }),
            ),
            catchError(() => {
              patchState(store, {
                error:
                  'Failed to fetch repositories. GitHub API rate limit may have been reached.',
                isLoading: false,
              });
              return of(null);
            }),
          );
        }),
      ),
    );

    const loadMore = rxMethod<Omit<LoadParams, 'page'>>(
      pipe(
        tap(() => patchState(store, { isLoadingMore: true, error: null })),
        switchMap(({ query, sort, order, perPage }) => {
          const nextPage = store.loadedMaxPage() + 1;
          return githubService
            .searchRepositories({ q: query, sort, order, per_page: perPage, page: nextPage })
            .pipe(
              tap((res) =>
                patchState(store, {
                  repos: [...store.repos(), ...res.items],
                  totalCount: res.total_count,
                  loadedMaxPage: nextPage,
                  isLoadingMore: false,
                }),
              ),
              catchError(() => {
                patchState(store, {
                  error: 'Failed to load more repositories.',
                  isLoadingMore: false,
                });
                return of(null);
              }),
            );
        }),
      ),
    );

    return { loadSinglePage, loadPagesUpTo, loadMore };
  }),
);
