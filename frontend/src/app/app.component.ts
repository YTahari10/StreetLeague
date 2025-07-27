import { Component } from '@angular/core';
import { MatchListComponent } from './matches/match-list/match-list.component';
import { HttpClientModule } from '@angular/common/http';
import { MatchFormComponent } from './matches/match-form/match-form.component';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import keycloak from '../keycloak-init';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ HttpClientModule, RouterOutlet, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'streetleague-frontend';

  ngOnInit() {
    // Check authentication with Keycloak and handle login
    console.log('App component initialized, Keycloak authenticated:', keycloak.authenticated);
    if (!keycloak.authenticated) {
      console.log('User not authenticated, redirecting to login...');
      keycloak.login();
    }
  }
}
