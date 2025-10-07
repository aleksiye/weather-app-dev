import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Search } from '../search/search';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, Search],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);

  searchSubmitted = output<string>();

  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;

  onSearchSubmitted(query: string): void {
    this.searchSubmitted.emit(query);
  }

  onAccount(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/auth']);
    }
  }
  onLogout(): void {
    this.authService.logout();
  }
}
