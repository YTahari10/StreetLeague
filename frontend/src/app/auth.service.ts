import { Injectable } from '@angular/core';
import keycloak from '../keycloak-init';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  /**
   * Get current user information
   */
  getCurrentUser() {
    if (keycloak.tokenParsed) {
      return {
        username: keycloak.tokenParsed['preferred_username'],
        email: keycloak.tokenParsed['email'],
        firstName: keycloak.tokenParsed['given_name'] || 'User',
        lastName: keycloak.tokenParsed['family_name'] || '',
        roles: this.getUserRoles()
      };
    }
    return null;
  }

  /**
   * Get user's roles
   */
  getUserRoles(): string[] {
    return keycloak.tokenParsed?.realm_access?.roles || [];
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    return keycloak.hasRealmRole(role);
  }

  // ===== PERMISSION METHODS =====

  /**
   * Can user create matches?
   */
  canCreateMatches(): boolean {
    return this.hasRole('coach') || this.hasRole('organizer') || this.hasRole('admin');
  }

  /**
   * Can user delete matches?
   */
  canDeleteMatches(): boolean {
    return this.hasRole('coach') || this.hasRole('organizer') || this.hasRole('admin');
  }

  /**
   * Can user create events?
   */
  canCreateEvents(): boolean {
    return this.hasRole('organizer') || this.hasRole('admin');
  }

  /**
   * Can user manage all users?
   */
  canManageUsers(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Can user view all matches?
   */
  canViewAllMatches(): boolean {
    return this.hasRole('coach') || this.hasRole('organizer') || this.hasRole('admin');
  }

  /**
   * Can user send invitations?
   */
  canSendInvitations(): boolean {
    return this.hasRole('coach') || this.hasRole('organizer') || this.hasRole('admin');
  }

  /**
   * Is user a regular player?
   */
  isPlayer(): boolean {
    return this.hasRole('player');
  }

  /**
   * Is user a coach?
   */
  isCoach(): boolean {
    return this.hasRole('coach');
  }

  /**
   * Is user an organizer?
   */
  isOrganizer(): boolean {
    return this.hasRole('organizer');
  }

  /**
   * Is user an admin?
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Get user's primary role (highest permission level)
   */
  getPrimaryRole(): string {
    if (this.isAdmin()) return 'Administrator';
    if (this.isOrganizer()) return 'Event Organizer';
    if (this.isCoach()) return 'Coach';
    if (this.isPlayer()) return 'Player';
    return 'User';
  }

  /**
   * Logout user
   */
  logout(): void {
    keycloak.logout({
      redirectUri: window.location.origin + '/matches'
    });
  }

  /**
   * Open account management page
   */
  manageAccount(): void {
    keycloak.accountManagement();
  }
}
