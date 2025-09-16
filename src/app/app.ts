import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Home } from './home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Home],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('weather-app-dev');
}

