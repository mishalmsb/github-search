import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GitHubRepo } from '../../models/github.models';

@Component({
  selector: 'app-repo-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './repo-card.html',
})
export class RepoCardComponent {
  readonly repo = input.required<GitHubRepo>();

  formatCount(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
    return String(n);
  }
}
