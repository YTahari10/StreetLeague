import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

interface NavItem {
  title: string;
  icon: string;
  route: string;
  roles: string[];
  badge?: string;
  badgeColor?: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="streetleague-nav" *ngIf="isAuthenticated">
      <div class="nav-container">
        <!-- Logo and Brand -->
        <div class="nav-brand" [routerLink]="'/dashboard'">
          <i class="fas fa-trophy brand-icon"></i>
          <span class="brand-text">StreetLeague</span>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-toggle" (click)="toggleMobileMenu()" [class.active]="isMobileMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Navigation Items -->
        <ul class="nav-items" [class.mobile-open]="isMobileMenuOpen">
          <li *ngFor="let item of getVisibleNavItems()" class="nav-item">
            <a [routerLink]="item.route" 
               routerLinkActive="active" 
               class="nav-link"
               (click)="closeMobileMenu()">
              <i [class]="item.icon" class="nav-icon"></i>
              <span class="nav-text">{{item.title}}</span>
              <span *ngIf="item.badge" 
                    class="nav-badge" 
                    [class]="'bg-' + (item.badgeColor || 'primary')">
                {{item.badge}}
              </span>
            </a>
          </li>
        </ul>

        <!-- User Menu -->
        <div class="user-menu" *ngIf="currentUser">
          <div class="user-info" (click)="toggleUserDropdown()">
            <div class="user-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="user-details">
              <span class="user-name">{{currentUser.firstName || 'Utilisateur'}}</span>
              <span class="user-role">{{authService.getPrimaryRole() | titlecase}}</span>
            </div>
            <i class="fas fa-chevron-down dropdown-arrow" [class.rotated]="isUserDropdownOpen"></i>
          </div>
          
          <!-- User Dropdown -->
          <div class="user-dropdown" [class.show]="isUserDropdownOpen">
            <a href="#" class="dropdown-item" (click)="goToProfile($event)">
              <i class="fas fa-user-edit"></i>
              Mon Profil
            </a>
            <a href="#" class="dropdown-item" (click)="goToSettings($event)">
              <i class="fas fa-cog"></i>
              Paramètres
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item logout" (click)="logout($event)">
              <i class="fas fa-sign-out-alt"></i>
              Déconnexion
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any;
  isMobileMenuOpen = false;
  isUserDropdownOpen = false;

  navItems: NavItem[] = [
    {
      title: 'Tableau de bord',
      icon: 'fas fa-home',
      route: '/dashboard',
      roles: ['player', 'coach', 'organizer', 'admin']
    },
    {
      title: 'Matchs',
      icon: 'fas fa-futbol',
      route: '/matches',
      roles: ['player', 'coach', 'organizer', 'admin'],
      badge: '5',
      badgeColor: 'success'
    },
    {
      title: 'Événements',
      icon: 'fas fa-calendar-alt',
      route: '/evenements',
      roles: ['player', 'coach', 'organizer', 'admin'],
      badge: '3',
      badgeColor: 'primary'
    },
    {
      title: 'Créer Match',
      icon: 'fas fa-plus-circle',
      route: '/matches',
      roles: ['coach', 'organizer', 'admin']
    },
    {
      title: 'Nouvel Événement',
      icon: 'fas fa-calendar-plus',
      route: '/evenements/create',
      roles: ['organizer', 'admin']
    },
    {
      title: 'Mes Invitations',
      icon: 'fas fa-envelope',
      route: '/my-invitations',
      roles: ['player', 'coach', 'organizer', 'admin'],
      badge: '2',
      badgeColor: 'warning'
    }
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadUserData();
  }

  checkAuthentication() {
    // Check actual Keycloak authentication status
    this.isAuthenticated = this.authService.getCurrentUser() !== null;
    console.log('Navigation - Authentication status:', this.isAuthenticated);
  }

  loadUserData() {
    this.currentUser = {
      firstName: 'Utilisateur',
      lastName: 'StreetLeague',
      role: this.authService.getPrimaryRole()
    };
  }

  getVisibleNavItems(): NavItem[] {
    const userRoles = this.authService.getUserRoles();
    console.log('User roles for navigation:', userRoles);
    
    return this.navItems.filter(item => {
      // Check if user has any of the required roles for this nav item
      const hasRequiredRole = item.roles.some(role => 
        this.authService.hasRole(role)
      );
      console.log(`Nav item "${item.title}" - Required roles:`, item.roles, '- Has access:', hasRequiredRole);
      return hasRequiredRole;
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.isUserDropdownOpen = false; // Close user dropdown when opening mobile menu
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  goToProfile(event: Event) {
    event.preventDefault();
    this.isUserDropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  goToSettings(event: Event) {
    event.preventDefault();
    this.isUserDropdownOpen = false;
    this.router.navigate(['/settings']);
  }

  logout(event: Event) {
    event.preventDefault();
    this.isUserDropdownOpen = false;
    this.authService.logout();
  }
}
