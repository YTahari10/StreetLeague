import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SportType = 'football' | 'basketball' | 'tennis' | 'volleyball' | 'baseball' | 'golf' | 'swimming' | 'running' | 'cycling' | 'soccer';

@Component({
  selector: 'app-sports-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sports-icon" [class]="'sport-' + sport" [ngStyle]="{'width.px': size, 'height.px': size}">
      <i *ngIf="useIcon" [class]="iconClass" [ngStyle]="{'font-size.px': size * 0.7, 'color': color}"></i>
      <svg *ngIf="!useIcon" [attr.width]="size" [attr.height]="size" [attr.viewBox]="viewBox" class="custom-sport-svg">
        <ng-container [ngSwitch]="sport">
          <!-- Football -->
          <g *ngSwitchCase="'football'">
            <ellipse cx="50" cy="50" rx="30" ry="20" fill="currentColor"/>
            <path d="M20 45 L80 45 M20 55 L80 55 M35 30 L35 70 M50 30 L50 70 M65 30 L65 70" 
                  stroke="white" stroke-width="2" fill="none"/>
          </g>
          <!-- Basketball -->
          <g *ngSwitchCase="'basketball'">
            <circle cx="50" cy="50" r="30" fill="currentColor"/>
            <path d="M20 35 Q50 20 80 35 M20 65 Q50 80 80 65 M35 20 Q50 50 35 80 M65 20 Q50 50 65 80" 
                  stroke="white" stroke-width="2" fill="none"/>
          </g>
          <!-- Tennis -->
          <g *ngSwitchCase="'tennis'">
            <circle cx="50" cy="50" r="30" fill="currentColor"/>
            <path d="M30 30 L70 70 M70 30 L30 70 M20 50 L80 50 M50 20 L50 80" 
                  stroke="white" stroke-width="1.5" fill="none"/>
          </g>
          <!-- Soccer (default) -->
          <g *ngSwitchDefault>
            <circle cx="50" cy="50" r="30" fill="currentColor"/>
            <path d="M35 25 L50 35 L65 25 L70 40 L60 55 L50 50 L40 55 L30 40 Z" 
                  stroke="white" stroke-width="2" fill="none"/>
            <path d="M50 35 L50 50 M35 45 L65 45" stroke="white" stroke-width="1.5" fill="none"/>
          </g>
        </ng-container>
      </svg>
    </div>
  `,
  styles: [`
    .sports-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color, #007bff), var(--secondary-color, #6c757d));
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .sports-icon:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    }

    .sports-icon i {
      transition: all 0.3s ease;
    }

    .custom-sport-svg {
      color: white;
      filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));
    }

    /* Sport-specific themes */
    .sport-football {
      background: linear-gradient(135deg, #8B4513, #A0522D);
    }

    .sport-basketball {
      background: linear-gradient(135deg, #FF8C00, #FF4500);
    }

    .sport-tennis {
      background: linear-gradient(135deg, #32CD32, #228B22);
    }

    .sport-volleyball {
      background: linear-gradient(135deg, #FFD700, #FFA500);
    }

    .sport-baseball {
      background: linear-gradient(135deg, #FFFFFF, #F5F5F5);
      color: #333;
    }

    .sport-golf {
      background: linear-gradient(135deg, #006400, #228B22);
    }

    .sport-swimming {
      background: linear-gradient(135deg, #00CED1, #4682B4);
    }

    .sport-running {
      background: linear-gradient(135deg, #DC143C, #B22222);
    }

    .sport-cycling {
      background: linear-gradient(135deg, #FFD700, #FF8C00);
    }

    .sport-soccer {
      background: linear-gradient(135deg, #000000, #333333);
    }

    /* Animation for active state */
    .sports-icon.active {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `]
})
export class SportsIconComponent {
  @Input() sport: SportType = 'soccer';
  @Input() size: number = 48;
  @Input() color: string = 'white';
  @Input() useIcon: boolean = false; // Toggle between Font Awesome icons and custom SVG
  @Input() active: boolean = false;

  get iconClass(): string {
    const iconMap: { [key in SportType]: string } = {
      football: 'fas fa-football-ball',
      basketball: 'fas fa-basketball-ball',
      tennis: 'fas fa-tennis-ball',
      volleyball: 'fas fa-volleyball-ball',
      baseball: 'fas fa-baseball-ball',
      golf: 'fas fa-golf-ball',
      swimming: 'fas fa-swimmer',
      running: 'fas fa-running',
      cycling: 'fas fa-biking',
      soccer: 'fas fa-futbol'
    };
    return iconMap[this.sport] || 'fas fa-futbol';
  }

  get viewBox(): string {
    return '0 0 100 100';
  }
}
