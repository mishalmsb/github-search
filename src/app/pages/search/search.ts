import {
  Component,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
  untracked,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar';
import { RepoCardComponent } from '../../components/repo-card/repo-card';
import { SearchStore } from '../../store/search.store';
import { OrderOption, SortOption } from '../../models/github.models';
import { CATEGORIES } from '../../config/categories.config';

@Component({
  selector: 'app-search',
  standalone: true,
  providers: [SearchStore],
  imports: [NavbarComponent, RepoCardComponent, FormsModule, DecimalPipe],
  templateUrl: './search.html',
})
export class SearchComponent {
  readonly store = inject(SearchStore);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly query = input<string>('');
  readonly page = input(1, {
    transform: (v: string | number | undefined) => Number(v) || 1,
  });
  readonly sort = input<SortOption>('stars');
  readonly order = input<OrderOption>('desc');
  readonly isCategory = input<boolean>(false);
  readonly categoryLabel = input<string>('');

  readonly displayTitle = computed(() => {
    const q = this.query();
    const label = this.categoryLabel();
    return label || (q ? q.charAt(0).toUpperCase() + q.slice(1) : 'Search');
  });

  readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'stars', label: 'Most Stars' },
    { value: 'forks', label: 'Most Forks' },
    { value: 'updated', label: 'Recently Updated' },
    { value: 'help-wanted-issues', label: 'Help Wanted' },
  ];

  private readonly searchKey = computed(() => `${this.query()}|${this.sort()}|${this.order()}`);
  private lastSearchKey = '';

  constructor() {
    effect(() => {
      const key = this.searchKey();
      const page = this.page();
      const query = this.query();

      if (!query) return;

      untracked(() => {
        const isNewSearch = key !== this.lastSearchKey;
        if (!isNewSearch) return;

        this.lastSearchKey = key;

        const params = {
          query,
          page,
          sort: this.sort(),
          order: this.order(),
          perPage: 10,
        };

        if (this.isBrowser) {
          this.store.loadPagesUpTo(params);
        } else {
          this.store.loadSinglePage(params);
        }

        this.updateSeo(query, page);
      });
    });
  }

  loadMore(): void {
    const query = this.query();
    const nextPage = this.store.loadedMaxPage() + 1;

    this.store.loadMore({
      query,
      sort: this.sort(),
      order: this.order(),
      perPage: 10,
    });

    this.router.navigate([], {
      queryParams: { page: nextPage },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    this.setCanonical(nextPage);
  }

  changeSort(sort: SortOption): void {
    this.router.navigate([], {
      queryParams: { sort, page: null },
      queryParamsHandling: 'merge',
    });
  }

  changeOrder(order: OrderOption): void {
    this.router.navigate([], {
      queryParams: { order, page: null },
      queryParamsHandling: 'merge',
    });
  }

  private updateSeo(query: string, page: number): void {
    const label = this.categoryLabel() || query;
    const capitalized = label.charAt(0).toUpperCase() + label.slice(1);
    const pageStr = page > 1 ? ` — Page ${page}` : '';

    this.titleService.setTitle(`${capitalized} Repositories${pageStr} | GitHub Search`);
    this.meta.updateTag({
      name: 'description',
      content: `Discover top ${label} repositories on GitHub, sorted by stars.${page > 1 ? ` Page ${page}.` : ''}`,
    });
    this.meta.updateTag({ property: 'og:title', content: `${capitalized} Repositories | GitHub Search` });

    this.setCanonical(page);
  }

  private setCanonical(page: number): void {
    const basePath = this.doc.location.pathname;
    const canonical = page > 1 ? `${basePath}?page=${page}` : basePath;

    let link = this.doc.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = this.doc.createElement('link') as HTMLLinkElement;
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
  }
}
