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
  isSubmitting = false;
  originalEvent: any = null; // Store original event data

  // Liste de sports avec icônes
  sports = [
    { value: 'football', label: 'Football', icon: '⚽' },
    { value: 'basketball', label: 'Basketball', icon: '🏀' },
    { value: 'tennis', label: 'Tennis', icon: '🎾' },
    { value: 'volleyball', label: 'Volleyball', icon: '🏐' },
    { value: 'natation', label: 'Natation', icon: '🏊‍♂️' },
    { value: 'musculation', label: 'Musculation', icon: '🏋️‍♂️' },
    { value: 'running', label: 'Course à pied', icon: '🏃‍♂️' },
    { value: 'cycling', label: 'Cyclisme', icon: '🚴‍♂️' }
  ];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      sport: ['', Validators.required],
      dateDebut: ['', [Validators.required, this.futureDateValidator]],
      dateFin: ['', Validators.required],
      lieu: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]]
    }, { validators: this.dateRangeValidator });

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
        // Store the original event data for merging later
        this.originalEvent = event;
        
        this.eventForm.patchValue({
          nom: event.nom,
          sport: event.sport,
          dateDebut: event.dateDebut || event.dateHeure,
          dateFin: event.dateFin || event.dateHeure,
          lieu: event.lieu,
          description: event.description
        });
      }
    });
  }

  // Custom validators
  futureDateValidator(control: any) {
    const selectedDate = new Date(control.value);
    const now = new Date();
    
    if (control.value && selectedDate <= now) {
      return { pastDate: true };
    }
    return null;
  }

  dateRangeValidator(group: any) {
    const start = group.get('dateDebut')?.value;
    const end = group.get('dateFin')?.value;
    
    if (start && end && new Date(start) >= new Date(end)) {
      group.get('dateFin')?.setErrors({ endBeforeStart: true });
      return { endBeforeStart: true };
    }
    
    if (group.get('dateFin')?.errors?.['endBeforeStart']) {
      delete group.get('dateFin')?.errors?.['endBeforeStart'];
      if (Object.keys(group.get('dateFin')?.errors || {}).length === 0) {
        group.get('dateFin')?.setErrors(null);
      }
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.eventForm.value;

    // Format the date for backend
    const formattedDate = this.formatDateForBackend(formData.dateDebut);

    // Merge original event data with the updated fields
    const updatedEvent = {
      ...this.originalEvent, // spread original event data
      nom: formData.nom,
      sport: formData.sport,
      description: formData.description,
      lieu: formData.lieu,
      dateHeure: formattedDate,
      // preserve other fields if any
    };

    console.log('Updating event with data:', updatedEvent);

    this.eventService.updateEvent(this.eventId, updatedEvent).subscribe({
      next: () => {
        alert('Événement mis à jour avec succès!');
        this.router.navigate(['/evenements']);
      },
      error: (error) => {
        console.error('Update error:', error);
        alert('Erreur lors de la mise à jour : ' + error.message);
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/evenements']);
  }

  // Helper method to format date for backend
  private formatDateForBackend(dateString: string): string {
    if (!dateString) return '';
    
    // Convert from HTML datetime-local format (YYYY-MM-DDTHH:mm) 
    // to backend format (YYYY-MM-DDTHH:mm:ss)
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19); // Remove milliseconds and timezone
  }
}
