import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Search } from '../search/search';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, Search],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  searchSubmitted = output<string>();
  constructor(private router: Router) {}
  onSearchSubmitted(query: string): void {
    this.searchSubmitted.emit(query);
  }

  onAccount(): void {
    this.router.navigate(['/auth']);
  }
}
