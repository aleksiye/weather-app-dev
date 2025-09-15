import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search query', () => {
    expect(component.searchQuery).toBe('');
  });

  it('should call onSearch when search method is triggered', () => {
    spyOn(console, 'log');
    component.searchQuery = 'London';
    component.onSearch();
    expect(console.log).toHaveBeenCalledWith('Searching for:', 'London');
  });

  it('should not search with empty query', () => {
    spyOn(console, 'log');
    component.searchQuery = '   ';
    component.onSearch();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should call onLogin when login button is clicked', () => {
    spyOn(console, 'log');
    component.onLogin();
    expect(console.log).toHaveBeenCalledWith('Login clicked');
  });

  it('should render search input with placeholder', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const searchInput = compiled.querySelector('.search-input') as HTMLInputElement;
    expect(searchInput?.placeholder).toBe('Search for a city...');
  });

  it('should render logo text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logoText = compiled.querySelector('.logo-text');
    expect(logoText?.textContent).toBe('WeatherApp');
  });
});
