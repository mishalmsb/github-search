export interface GitHubOwner {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubLicense {
  key: string;
  name: string;
  spdx_id: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  pushed_at: string;
  owner: GitHubOwner;
  topics: string[];
  license: GitHubLicense | null;
  default_branch: string;
  private: boolean;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

export type SortOption = 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
export type OrderOption = 'asc' | 'desc';

export interface SearchParams {
  q: string;
  sort?: SortOption;
  order?: OrderOption;
  per_page?: number;
  page?: number;
}
