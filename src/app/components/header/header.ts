import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  searchQuery: string = '';

  onSearch(): void {
    if (this.searchQuery.trim()) {
      //TODO: Implement search functionality
      console.log('Searching for:', this.searchQuery);
    }
  }

  onLogin(): void {
    //TODO: Implement login functionality
    console.log('Login clicked');
  }
}
