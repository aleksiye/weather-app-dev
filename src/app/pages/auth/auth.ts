import { Component } from '@angular/core';
import { Login } from '../../components/login/login';
import { Register } from '../../components/register/register';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-auth',
  imports: [Login, Register, Header, Footer],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth {

}
