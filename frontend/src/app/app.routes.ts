import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'matches', pathMatch: 'full' },
  {
    path: 'matches',
    loadComponent: () => import('./matches/match-list/match-list.component').then(m => m.MatchListComponent)
  },
  {
    path: 'matches/new/:eventId',
    loadComponent: () => import('./matches/match-form/match-form.component').then(m => m.MatchFormComponent)
  },
  {
    path: 'matches/edit/:id',
    loadComponent: () => import('./matches/match-edit/match-edit.component').then(m => m.MatchEditComponent)
  },
  {
    path: 'invitations/:matchId',
    loadComponent: () => import('./matches/invitations/invitations.component').then(m => m.InvitationsComponent)
  },
  {
    path: 'evenements',
    loadComponent: () => import('./evenements/event-list/event-list.component').then(m => m.EventListComponent)
  },
  {
    path: 'evenements/create',
    loadComponent: () => import('./evenements/event-form/event-form.component').then(m => m.EventFormComponent)
  },
  {
    path: 'evenements/edit/:id',
    loadComponent: () => import('./evenements/event-edit/event-edit.component').then(m => m.EventEditComponent)
  },
  {
    path: 'invitation/accept/:invitationId',
    loadComponent: () => import('./invitation-confirmation/invitation-confirmation.component').then(m => m.InvitationConfirmationComponent)
  },
  {
    path: 'invitation/refuse/:invitationId',
    loadComponent: () => import('./invitation-confirmation/invitation-confirmation.component').then(m => m.InvitationConfirmationComponent)
  }
];
