import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  
  // 🏠 DASHBOARD - Main page
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  
  // 🏠 MATCHES - Accessible to all authenticated users
  {
    path: 'matches',
    loadComponent: () => import('./matches/match-list/match-list.component').then(m => m.MatchListComponent)
  },
  
  // ➕ CREATE MATCH - Only COACH, ORGANIZER, ADMIN
  {
    path: 'matches/new/:eventId',
    loadComponent: () => import('./matches/match-form/match-form.component').then(m => m.MatchFormComponent),
    canActivate: [RoleGuard],
    data: { roles: ['coach', 'organizer', 'admin'] }
  },
  
  // 👀 VIEW MATCH DETAILS - All authenticated users (read-only for players)
  {
    path: 'matches/view/:id',
    loadComponent: () => import('./matches/match-edit/match-edit.component').then(m => m.MatchEditComponent)
    // No role restriction - everyone can view matches
  },
  
  // ✏️ EDIT MATCH - Only COACH, ORGANIZER, ADMIN
  {
    path: 'matches/edit/:id',
    loadComponent: () => import('./matches/match-edit/match-edit.component').then(m => m.MatchEditComponent),
    canActivate: [RoleGuard],
    data: { roles: ['coach', 'organizer', 'admin'] }
  },
  
  // 📧 INVITATIONS - Only COACH, ORGANIZER, ADMIN
  {
    path: 'invitations/:matchId',
    loadComponent: () => import('./matches/invitations/invitations.component').then(m => m.InvitationsComponent),
    canActivate: [RoleGuard],
    data: { roles: ['coach', 'organizer', 'admin'] }
  },
  
  // 🎪 EVENTS LIST - All authenticated users can view events
  {
    path: 'evenements',
    loadComponent: () => import('./evenements/event-list/event-list.component').then(m => m.EventListComponent)
    // No role restriction - everyone can view events
  },
  
  // ➕ CREATE EVENT - Only ORGANIZER, ADMIN
  {
    path: 'evenements/create',
    loadComponent: () => import('./evenements/event-form/event-form.component').then(m => m.EventFormComponent),
    canActivate: [RoleGuard],
    data: { roles: ['organizer', 'admin'] }
  },
  
  // ✏️ EDIT EVENT - Only ORGANIZER, ADMIN
  {
    path: 'evenements/edit/:id',
    loadComponent: () => import('./evenements/event-edit/event-edit.component').then(m => m.EventEditComponent),
    canActivate: [RoleGuard],
    data: { roles: ['organizer', 'admin'] }
  },
  
  // 📨 INVITATION RESPONSES - Accessible to all (players need to respond)
  {
    path: 'invitation/accept/:invitationId',
    loadComponent: () => import('./invitation-confirmation/invitation-confirmation.component').then(m => m.InvitationConfirmationComponent)
  },
  {
    path: 'invitation/refuse/:invitationId',
    loadComponent: () => import('./invitation-confirmation/invitation-confirmation.component').then(m => m.InvitationConfirmationComponent)
  },
  
  // 🚫 ACCESS DENIED PAGE
  {
    path: 'access-denied',
    loadComponent: () => import('./components/access-denied/access-denied.component').then(m => m.AccessDeniedComponent)
  },
  
  // 🔐 LOGIN
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  
  // 📧 PLAYER INVITATIONS - Players can view and respond to their invitations
  {
    path: 'my-invitations',
    loadComponent: () => import('./player/player-invitations/player-invitations.component').then(m => m.PlayerInvitationsComponent)
  }
];
