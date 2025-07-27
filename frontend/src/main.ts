import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/auth.interceptor';
import { AppComponent } from './app/app.component';
import { FormsModule } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';

import { initKeycloak } from './keycloak-init';

initKeycloak(() => {
  console.log('🚀 Bootstrapping Angular application...');
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      provideHttpClient(withInterceptors([authInterceptor])),
      importProvidersFrom(FormsModule)
    ],
  }).catch(err => console.error('💥 Bootstrap error:', err));
});
