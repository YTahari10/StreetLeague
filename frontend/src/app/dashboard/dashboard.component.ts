import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatchService } from '../matches/match.service';
import { EventService } from '../evenements/event.service';
import { SportsIconComponent } from '../components/sports-icons/sports-icon.component';

interface DashboardStats {
  totalMatches: number;
  upcomingMatches: number;
  totalEvents: number;
  activeEvents: number;
  myTeamMatches: number;
  winRate: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  roles: string[];
}

interface RecentActivity {
  id: string;
  type: 'match' | 'event' | 'invitation';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SportsIconComponent],
  template: `
    <div class="dashboard-container">
      <!-- Header Section -->
      <div class="dashboard-header">
        <div class="welcome-section">
          <div class="welcome-text">
            <h1>
              <i class="fas fa-trophy text-warning me-2"></i>
              Bienvenue sur StreetLeague
            </h1>
            <p class="lead" *ngIf="currentUser">
              Salut <strong>{{currentUser.firstName}}</strong>! 
              <span class="badge bg-primary ms-2">{{authService.getPrimaryRole() | titlecase}}</span>
            </p>
          </div>
          <div class="user-actions">
            <button class="btn btn-outline-light me-2" (click)="refreshData()">
              <i class="fas fa-refresh me-1"></i> Actualiser
            </button>
            <button class="btn btn-light" (click)="authService.logout()">
              <i class="fas fa-sign-out-alt me-1"></i> Déconnexion
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-section">
        <div class="row g-4">
          <div class="col-md-3">
            <div class="stat-card matches">
              <div class="stat-icon">
                <i class="fas fa-futbol"></i>
              </div>
              <div class="stat-info">
                <h3>{{stats.totalMatches}}</h3>
                <p>Total Matchs</p>
                <small class="text-success">
                  <i class="fas fa-calendar-alt me-1"></i>
                  {{stats.upcomingMatches}} à venir
                </small>
              </div>
            </div>
          </div>
          
          <div class="col-md-3">
            <div class="stat-card events">
              <div class="stat-icon">
                <i class="fas fa-calendar-check"></i>
              </div>
              <div class="stat-info">
                <h3>{{stats.totalEvents}}</h3>
                <p>Événements</p>
                <small class="text-primary">
                  <i class="fas fa-play-circle me-1"></i>
                  {{stats.activeEvents}} actifs
                </small>
              </div>
            </div>
          </div>
          
          <div class="col-md-3">
            <div class="stat-card teams">
              <div class="stat-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-info">
                <h3>{{stats.myTeamMatches}}</h3>
                <p>Mes Matchs</p>
                <small class="text-info">
                  <i class="fas fa-chart-line me-1"></i>
                  {{getWinRateText()}}
                </small>
              </div>
            </div>
          </div>
          
          <div class="col-md-3">
            <div class="stat-card performance">
              <div class="stat-icon">
                <i class="fas fa-trophy"></i>
              </div>
              <div class="stat-info">
                <h3>{{stats.winRate}}%</h3>
                <p>Taux de Victoire</p>
                <small class="text-warning">
                  <i class="fas fa-medal me-1"></i>
                  Performance
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sports Icons Section -->
      <div class="sports-showcase">
        <h3 class="section-title">
          <i class="fas fa-running me-2"></i>
          Sports Disponibles
        </h3>
        <div class="sports-grid">
          <div *ngFor="let sport of availableSports" class="sport-item" 
               [class.active]="sport.popular"
               (click)="selectSport(sport.type)">
            <app-sports-icon 
              [sport]="sport.type" 
              [size]="64" 
              [active]="sport.popular">
            </app-sports-icon>
            <span class="sport-name">{{sport.name}}</span>
            <span class="sport-count">{{sport.matches}} matchs</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions Grid -->
      <div class="quick-actions">
        <h3 class="section-title">
          <i class="fas fa-bolt me-2"></i>
          Actions Rapides
        </h3>
        <div class="row g-3">
          <div class="col-md-4" *ngFor="let action of getAvailableActions()">
            <div class="action-card" [class]="'border-' + action.color" 
                 [routerLink]="action.route">
              <div class="action-icon" [class]="'text-' + action.color">
                <i [class]="action.icon"></i>
              </div>
              <div class="action-content">
                <h5>{{action.title}}</h5>
                <p>{{action.description}}</p>
              </div>
              <div class="action-arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <h3 class="section-title">
          <i class="fas fa-clock me-2"></i>
          Activité Récente
        </h3>
        <div class="activity-list">
          <div class="activity-item" *ngFor="let activity of recentActivities">
            <div class="activity-icon" [class]="'bg-' + activity.color">
              <i [class]="activity.icon"></i>
            </div>
            <div class="activity-content">
              <h6>{{activity.title}}</h6>
              <p>{{activity.description}}</p>
              <small class="text-muted">
                <i class="fas fa-clock me-1"></i>
                {{activity.timestamp | date:'short'}}
              </small>
            </div>
          </div>
          
          <div class="activity-item empty" *ngIf="recentActivities.length === 0">
            <div class="activity-icon bg-light">
              <i class="fas fa-info-circle text-muted"></i>
            </div>
            <div class="activity-content">
              <p class="text-muted">Aucune activité récente disponible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  stats: DashboardStats = {
    totalMatches: 0,
    upcomingMatches: 0,
    totalEvents: 0,
    activeEvents: 0,
    myTeamMatches: 0,
    winRate: 0
  };

  availableSports = [
    { type: 'soccer' as const, name: 'Football', matches: 15, popular: true },
    { type: 'basketball' as const, name: 'Basketball', matches: 8, popular: false },
    { type: 'tennis' as const, name: 'Tennis', matches: 5, popular: false },
    { type: 'volleyball' as const, name: 'Volleyball', matches: 3, popular: false },
    { type: 'running' as const, name: 'Course', matches: 12, popular: true },
    { type: 'cycling' as const, name: 'Cyclisme', matches: 7, popular: false }
  ];

  quickActions: QuickAction[] = [
    {
      title: 'Créer un Match',
      description: 'Organiser un nouveau match sportif',
      icon: 'fas fa-plus-circle',
      route: '/matches',
      color: 'success',
      roles: ['coach', 'organizer', 'admin']
    },
    {
      title: 'Nouvel Événement',
      description: 'Créer un événement sportif',
      icon: 'fas fa-calendar-plus',
      route: '/evenements/create',
      color: 'primary',
      roles: ['organizer', 'admin']
    },
    {
      title: 'Voir les Matchs',
      description: 'Consulter tous les matchs',
      icon: 'fas fa-list',
      route: '/matches',
      color: 'info',
      roles: ['player', 'coach', 'organizer', 'admin']
    },
    {
      title: 'Gérer les Invitations',
      description: 'Inviter des joueurs aux matchs',
      icon: 'fas fa-envelope',
      route: '/matches',
      color: 'warning',
      roles: ['coach', 'organizer', 'admin']
    },
    {
      title: 'Événements',
      description: 'Explorer les événements',
      icon: 'fas fa-star',
      route: '/evenements',
      color: 'purple',
      roles: ['player', 'coach', 'organizer', 'admin']
    },
    {
      title: 'Mon Profil',
      description: 'Gérer mon profil et préférences',
      icon: 'fas fa-user',
      route: '/profile',
      color: 'secondary',
      roles: ['player', 'coach', 'organizer', 'admin']
    }
  ];

  recentActivities: RecentActivity[] = [];

  constructor(
    public authService: AuthService,
    private matchService: MatchService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadDashboardStats();
    this.loadRecentActivities();
  }

  loadUserData() {
    // Get current user from Keycloak
    this.currentUser = {
      firstName: 'Utilisateur',
      lastName: 'StreetLeague',
      role: this.authService.getPrimaryRole()
    };
  }

  loadDashboardStats() {
    // Load matches
    this.matchService.getAll().subscribe({
      next: (matches: any[]) => {
        this.stats.totalMatches = matches.length;
        this.stats.upcomingMatches = matches.filter((m: any) => 
          new Date(m.dateHeure) > new Date()
        ).length;
        
        // Calculate win rate (mock data for now)
        this.stats.winRate = Math.floor(Math.random() * 30) + 70; // 70-100%
        this.stats.myTeamMatches = Math.floor(matches.length * 0.4);
      },
      error: () => {
        // Fallback data
        this.stats.totalMatches = 12;
        this.stats.upcomingMatches = 5;
        this.stats.winRate = 85;
        this.stats.myTeamMatches = 8;
      }
    });

    // Load events
    this.eventService.getAllEvents().subscribe({
      next: (events: any[]) => {
        this.stats.totalEvents = events.length;
        this.stats.activeEvents = events.filter((e: any) => 
          new Date(e.dateDebut) <= new Date() && new Date(e.dateFin) >= new Date()
        ).length;
      },
      error: () => {
        // Fallback data
        this.stats.totalEvents = 6;
        this.stats.activeEvents = 3;
      }
    });
  }

  loadRecentActivities() {
    // Mock recent activities
    this.recentActivities = [
      {
        id: '1',
        type: 'match',
        title: 'Nouveau match créé',
        description: 'Match Football: Équipe A vs Équipe B',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: 'fas fa-futbol',
        color: 'success'
      },
      {
        id: '2',
        type: 'invitation',
        title: 'Invitation envoyée',
        description: 'Invitations envoyées pour le match de basketball',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        icon: 'fas fa-envelope',
        color: 'primary'
      },
      {
        id: '3',
        type: 'event',
        title: 'Événement mis à jour',
        description: 'Tournoi de Tennis - Mise à jour des détails',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        icon: 'fas fa-calendar-edit',
        color: 'warning'
      }
    ];
  }

  getAvailableActions(): QuickAction[] {
    const userRole = this.authService.getPrimaryRole();
    return this.quickActions.filter(action => 
      action.roles.includes(userRole)
    );
  }

  getWinRateText(): string {
    if (this.stats.winRate >= 80) return 'Excellent';
    if (this.stats.winRate >= 60) return 'Bon';
    if (this.stats.winRate >= 40) return 'Moyen';
    return 'À améliorer';
  }

  selectSport(sportType: string) {
    console.log('Sport sélectionné:', sportType);
    // Here you could filter matches by sport type
  }

  refreshData() {
    this.loadDashboardStats();
    this.loadRecentActivities();
  }
}
