import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Search } from '../search/search';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, Search],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  searchSubmitted = output<string>();
  onSearchSubmitted(query: string): void {
    this.searchSubmitted.emit(query);
  }

  onLogin(): void {
    // TODO: Implement login functionality
    console.log('Login clicked');
  }
}
