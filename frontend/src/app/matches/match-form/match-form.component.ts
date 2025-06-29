import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

interface Equipe {
  id: string;
  nom: string;
}

@Component({
  selector: 'app-match-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.css']
})
export class MatchFormComponent implements OnInit {
  matchForm: FormGroup;
  submitted = false;
  successMessage = '';
  equipes: Equipe[] = [];
  eventId: string | null = null;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.matchForm = this.fb.group({
      equipe1: ['', Validators.required],
      equipe2: ['', Validators.required],
      dateHeure: ['', Validators.required],
      lieu: ['', Validators.required],
      statut: ['', Validators.required],
      scoreEquipe1: [0, Validators.required],
      scoreEquipe2: [0, Validators.required],
      convocations: [''],
      eventId: ['']
    });
  }

  ngOnInit(): void {
    // Récupérer eventId depuis les paramètres de la route
    this.route.queryParamMap.subscribe(params => {
      this.eventId = params.get('eventId');
      if (this.eventId) {
        this.matchForm.patchValue({ eventId: this.eventId });
      }
    });

    // Charger la liste des équipes depuis le backend
    this.http.get<Equipe[]>('http://localhost:8060/api/equipes').subscribe({
      next: (data) => {
        this.equipes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des équipes', err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.matchForm.invalid) {
      return;
    }

    const formValue = { ...this.matchForm.value };

    const equipe1Obj = this.equipes.find(eq => eq.id === formValue.equipe1);
    const equipe2Obj = this.equipes.find(eq => eq.id === formValue.equipe2);

    formValue.equipe1Id = equipe1Obj ? equipe1Obj.id : null;
    formValue.equipe2Id = equipe2Obj ? equipe2Obj.id : null;

    delete formValue.equipe1;
    delete formValue.equipe2;

    formValue.convocations = formValue.convocations
      ? formValue.convocations.split(',').map((j: string) => j.trim())
      : [];

    // Ajouter eventId au payload s'il existe
    if (this.eventId) {
      formValue.eventId = this.eventId;
    }

    this.http.post('http://localhost:8060/api/matches', formValue).subscribe({
      next: () => {
        this.successMessage = 'Match ajouté avec succès ✅';
        this.matchForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Erreur lors de la création du match', err);
        this.successMessage = '';
      }
    });
  }

  goToList(): void {
    this.router.navigate(['/matches']);
  }
  goBackToEvents(): void {
    this.router.navigate(['/evenements']);  // <-- ici le bon path, en français
  }
}
