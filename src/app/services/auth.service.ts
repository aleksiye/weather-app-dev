import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountData {
  password: string;
}

interface BackendAuthResponse {
  message: string;
  token: string;
  user: User;
}

interface MeResponse {
  user: User;
}

interface UpdateProfileResponse {
  message: string;
  user: User;
}

interface ChangePasswordResponse {
  message: string;
}

interface DeleteAccountResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = '/api';
  private readonly TOKEN_KEY = 'auth_token';

  private currentUserSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor() {
    // Don't call loadStoredAuth here - will be called by APP_INITIALIZER
  }

  async register(data: RegisterData): Promise<void> {
    try {
      const response = await this.http
        .post<BackendAuthResponse>(`${this.API_URL}/register`, data)
        .toPromise();
      if (response) {
        this.handleAuthSuccess(response);
      }
    } catch (error) {
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<void> {
    try {
      const response = await this.http
        .post<BackendAuthResponse>(`${this.API_URL}/login`, credentials)
        .toPromise();
      if (response) {
        this.handleAuthSuccess(response);
      }
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/']);
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      const response = await this.http
        .put<UpdateProfileResponse>(`${this.API_URL}/me`, data)
        .toPromise();
      
      if (response?.user) {
        // Update the current user signal with the new data
        this.currentUserSignal.set(response.user);
        return response.user;
      }
      throw new Error('Failed to update profile');
    } catch (error) {
      throw error;
    }
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      const response = await this.http
        .put<ChangePasswordResponse>(`${this.API_URL}/me/password`, data)
        .toPromise();
      
      if (!response) {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteAccount(data: DeleteAccountData): Promise<void> {
    try {
      const response = await this.http
        .request<DeleteAccountResponse>('DELETE', `${this.API_URL}/me`, { body: data })
        .toPromise();
      
      if (!response) {
        throw new Error('Failed to delete account');
      }
      
      // Clear local auth state after successful deletion
      this.currentUserSignal.set(null);
      this.tokenSignal.set(null);
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      throw error;
    }
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private handleAuthSuccess(response: BackendAuthResponse): void {
    this.currentUserSignal.set(response.user);
    this.tokenSignal.set(response.token);
    localStorage.setItem(this.TOKEN_KEY, response.token);
  }

  // Make this public so it can be called by APP_INITIALIZER
  async loadStoredAuth(): Promise<void> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.tokenSignal.set(token);
      try {
        const response = await this.http.get<MeResponse>(`${this.API_URL}/me`).toPromise();
        if (response?.user) {
          this.currentUserSignal.set(response.user);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        this.logout();
      }
    }
  }
}
