import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { Event } from '../event.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  isEditMode = false;
  eventId?: string;

  // Simulons une liste de centres d’intérêt/sports
  sports = ['Foot', 'Basket', 'Musculation', 'Natation', 'Tennis'];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      nom: ['', Validators.required],
      sport: ['', Validators.required],
      dateHeure: ['', Validators.required],
      lieu: ['', Validators.required],
      description: ['', Validators.required]
    });

    // Vérifie si on est en édition via paramètre d'URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.eventId = id;
        this.loadEvent(id);
      }
    });
  }

  loadEvent(id: string): void {
    this.eventService.getEventById(id).subscribe(event => {
      if (event) {
        this.eventForm.patchValue({
          nom: event.nom,
          sport: event.sport,
          dateHeure: event.dateHeure,
          lieu: event.lieu,
          description: event.description
        });
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const eventData: Event = this.eventForm.value;

    // Fix format dateHeure (ajout des secondes)
    if (eventData.dateHeure && eventData.dateHeure.length === 16) {
      eventData.dateHeure = eventData.dateHeure + ':00';
    }

    if (this.isEditMode && this.eventId) {
      this.eventService.updateEvent(this.eventId, eventData).subscribe(() => {
        alert('Événement mis à jour avec succès');
        this.router.navigate(['/evenements']);
      }, error => {
        alert('Erreur mise à jour event : ' + error.message);
      });
    } else {
      this.eventService.createEvent(eventData).subscribe(() => {
        alert('Événement créé avec succès');
        this.router.navigate(['/evenements']);
      }, error => {
        alert('Erreur création event : ' + error.message);
      });
    }
  }
  onCancel(): void {
    this.router.navigate(['/evenements']);
  }
}
