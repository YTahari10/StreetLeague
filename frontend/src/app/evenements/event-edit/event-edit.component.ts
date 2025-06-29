import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {
  eventForm!: FormGroup;
  eventId!: string;
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

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = id;
        this.loadEvent(id);
      } else {
        // Rediriger ou gérer erreur, pas d'id = pas d'édition
        this.router.navigate(['/evenements']);
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
    const eventData = this.eventForm.value;

    if (eventData.dateHeure && eventData.dateHeure.length === 16) {
      eventData.dateHeure += ':00'; // ajouter les secondes
    }

    this.eventService.updateEvent(this.eventId, eventData).subscribe(() => {
      alert('Événement mis à jour avec succès');
      this.router.navigate(['/evenements']);
    }, error => {
      alert('Erreur mise à jour : ' + error.message);
    });
  }

  onCancel(): void {
    this.router.navigate(['/evenements']);
  }
}
