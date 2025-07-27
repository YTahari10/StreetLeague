import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    
    console.log('🛡️ Route Guard: Required roles:', requiredRoles);
    console.log('🛡️ Route Guard: User roles:', this.authService.getUserRoles());
    
    if (!requiredRoles || requiredRoles.length === 0) {
      // No specific roles required, allow access
      return true;
    }

    // Check if user has any of the required roles
    const hasRequiredRole = requiredRoles.some(role => {
      if (role === 'admin') return this.authService.isAdmin();
      if (role === 'organizer') return this.authService.isOrganizer();
      if (role === 'coach') return this.authService.isCoach();
      if (role === 'player') return this.authService.isPlayer();
      return this.authService.hasRole(role);
    });

    if (!hasRequiredRole) {
      console.log('❌ Access denied: User does not have required roles');
      // Redirect to access denied page
      this.router.navigate(['/access-denied']);
      return false;
    }

    console.log('✅ Access granted');
    return true;
  }
}
