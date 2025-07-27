import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import keycloak from '../keycloak-init';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🔐 Auth Interceptor - Processing request:', req.method, req.url);
  
  // Skip interceptor for non-API requests or if not authenticated
  if (!req.url.includes('/api/') || !keycloak.authenticated) {
    console.log('⏭️ Skipping auth interceptor - Non-API request or not authenticated');
    console.log('  - URL includes /api/:', req.url.includes('/api/'));
    console.log('  - Keycloak authenticated:', keycloak.authenticated);
    return next(req);
  }

  console.log('🔄 Updating token with 30s minimum validity...');
  return from(keycloak.updateToken(30)).pipe(
    switchMap((refreshed) => {
      console.log('✅ Token update result - Refreshed:', refreshed);
      const token = keycloak.token;
      
      if (token) {
        console.log('🎫 Token available, length:', token.length);
        console.log('👤 User roles:', keycloak.realmAccess?.roles || 'No realm roles');
        console.log('🏢 Resource roles:', keycloak.resourceAccess || 'No resource roles');
        
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('📤 Sending authenticated request with Bearer token');
        return next(authReq).pipe(
          catchError(httpError => {
            console.error('❌ HTTP Error in authenticated request:', httpError.status, httpError.message);
            console.error('❌ Full error object:', httpError);
            if (httpError.error) {
              console.error('❌ Error details:', httpError.error);
            }
            if (httpError.status === 400) {
              console.error('🚫 400 Bad Request - Invalid request data');
              console.log('Request URL:', req.url);
              console.log('Request method:', req.method);
              console.log('Request body:', req.body);
            } else if (httpError.status === 401) {
              console.error('🚫 401 Unauthorized - Token might be invalid or expired');
            } else if (httpError.status === 403) {
              console.error('🚫 403 Forbidden - User lacks required permissions');
              console.log('Current user roles for debugging:', keycloak.realmAccess?.roles);
            }
            return throwError(() => httpError);
          })
        );
      } else {
        console.error('❌ No token available after refresh!');
        return next(req);
      }
    }),
    catchError(error => {
      console.error('❌ Error in auth interceptor token update:', error);
      return next(req);
    })
  );
};
