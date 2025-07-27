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
  isSubmitting = false;

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

    // Convert date format and use dateDebut as the main dateHeure for backend
    const adaptedData = {
      nom: formData.nom,
      sport: formData.sport,
      description: formData.description,
      lieu: formData.lieu,
      dateHeure: this.formatDateForBackend(formData.dateDebut)
    };

    if (this.isEditMode && this.eventId) {
      this.eventService.updateEvent(this.eventId, adaptedData).subscribe({
        next: () => {
          alert('Événement mis à jour avec succès!');
          this.router.navigate(['/evenements']);
        },
        error: (error) => {
          alert('Erreur lors de la mise à jour : ' + error.message);
          this.isSubmitting = false;
        }
      });
    } else {
      this.eventService.createEvent(adaptedData).subscribe({
        next: () => {
          alert('Événement créé avec succès!');
          this.router.navigate(['/evenements']);
        },
        error: (error) => {
          alert('Erreur lors de la création : ' + error.message);
          this.isSubmitting = false;
        }
      });
    }
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
