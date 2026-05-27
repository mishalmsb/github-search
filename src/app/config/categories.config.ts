export interface Category {
  slug: string;
  label: string;
  description: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: 'angular',
    label: 'Angular',
    description: 'Explore the Angular ecosystem — components, libraries, tools and more.',
    icon: 'A',
  },
  {
    slug: 'java',
    label: 'Java',
    description: 'Discover Java frameworks, utilities, and open-source projects.',
    icon: 'J',
  },
];
