import { Component } from '@angular/core';
import { MatchListComponent } from './matches/match-list/match-list.component';
import { HttpClientModule } from '@angular/common/http';
import { MatchFormComponent } from './matches/match-form/match-form.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ HttpClientModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'streetleague-frontend';
}
