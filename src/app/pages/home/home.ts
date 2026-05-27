import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { CATEGORIES } from '../../config/categories.config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './home.html',
})
export class HomeComponent {
  readonly categories = CATEGORIES;
}
