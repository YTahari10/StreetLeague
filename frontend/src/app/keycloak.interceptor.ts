import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import keycloak from '../keycloak-init';

@Injectable()
export class KeycloakInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor called for URL:', req.url);
    console.log('Keycloak authenticated:', keycloak.authenticated);
    console.log('Keycloak token available:', !!keycloak.token);
    
    if (!keycloak.authenticated) {
      console.error('User is not authenticated!');
      return next.handle(req);
    }

    return from(keycloak.updateToken(30)).pipe(
      switchMap((refreshed) => {
        console.log('Token refreshed:', refreshed);
        const token = keycloak.token;
        console.log('Current token:', token ? 'Token available' : 'No token');
        
        if (token) {
          const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
          console.log('Sending request with Authorization header to:', req.url);
          return next.handle(authReq);
        } else {
          console.error('No token available after refresh!');
          return next.handle(req);
        }
      }),
      catchError(error => {
        console.error('Error in interceptor:', error);
        return next.handle(req);
      })
    );
  }
}
