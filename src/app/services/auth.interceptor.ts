import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Public endpoints that don't require authentication
  const publicEndpoints = [
    'http://localhost:3000/v1/forecast.json',
    'http://localhost:3000/v1/current.json',
    'http://localhost:3000/v1/search.json'
  ];

  // Check if the request is to a public endpoint
  const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.startsWith(endpoint));

  // Check if this is an API request (both relative /api and absolute http://localhost:3000/api)
  const isApiRequest = req.url.startsWith('/api') || req.url.includes('/api/');

  // Only add token to requests going to our API (excluding public endpoints)
  if (token && isApiRequest && !isPublicEndpoint) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
