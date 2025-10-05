import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Forecast } from '../../services/forecast';
import { SearchResult } from '../../interfaces/search.interface';
import { SearchResults } from '../../interfaces/search.interface';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class Search {
  private forecastService = inject(Forecast);

  searchQuery = signal<string>('');
  searchSubmitted = output<string>();
  showSuggestions = signal<boolean>(false);
  suggestions = signal<SearchResult[]>([]);
  selectedIndex = signal<number>(-1);

  onQueryChange(query: string) {
    this.searchQuery.set(query);
    if (query.length >= 2) {
      this.forecastService.search(query).subscribe({
        next: (results) => {
          this.suggestions.set(results);
          this.showSuggestions.set(true);
          this.selectedIndex.set(-1);
        },
        error: (error) => {
          console.error('Error fetching search results:', error);
          this.suggestions.set([]);
        }
      });
    } else {
      this.suggestions.set([]);
      this.showSuggestions.set(false);
    }
  }
  onSearch(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      this.searchSubmitted.emit(query.trim());
      this.closeSuggestions();
    }
  }
  selectSuggestion(result: SearchResult) {
    this.searchSubmitted.emit(result.name);
    this.searchQuery.set(result.name);
    this.closeSuggestions();
  }
  closeSuggestions(): void {
    this.showSuggestions.set(false);
    this.suggestions.set([]);
    this.selectedIndex.set(-1);
  }
  onKeyPress(event: KeyboardEvent) {
    const suggestionList = this.suggestions();
    const currentIndex = this.selectedIndex();
    if (event.key === 'Enter') {
      if (currentIndex >= 0 && currentIndex < suggestionList.length) {
        this.selectSuggestion(suggestionList[currentIndex]);
      } else {
        this.onSearch();
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (currentIndex < suggestionList.length - 1) {
        this.selectedIndex.set(currentIndex + 1);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (currentIndex > 0) {
        this.selectedIndex.set(currentIndex - 1);
      }
    } else if (event.key === 'Escape') {
      this.closeSuggestions();
    }
  }

  onBlur(): void {
    setTimeout(() => {
      this.closeSuggestions();
    }, 200);
  }
}