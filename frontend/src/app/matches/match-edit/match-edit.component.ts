import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-match-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './match-edit.component.html',
})
export class MatchEditComponent implements OnInit {
  matchForm: FormGroup;
  submitted = false;
  successMessage = '';
  matchId: string | null = null;
  equipes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.matchForm = this.fb.group({
      id: [''],
      equipe1Id: ['', Validators.required],
      equipe2Id: ['', Validators.required],
      dateHeure: ['', Validators.required],
      lieu: ['', Validators.required],
      statut: ['', Validators.required],
      scoreEquipe1: [0, [Validators.required, Validators.min(0)]],
      scoreEquipe2: [0, [Validators.required, Validators.min(0)]],
      convocations: ['']
    }, { validators: this.equipesDifferentes });
  }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8060/api/equipes').subscribe(equipes => {
      this.equipes = equipes;
    });

    this.matchId = this.route.snapshot.paramMap.get('id');
    if (this.matchId) {
      this.http.get<any>(`http://localhost:8060/api/matches/${this.matchId}`).subscribe(data => {
        const formattedDate = data.dateHeure?.slice(0, 16);
        const convocationsStr = data.convocations?.join(', ') ?? '';
        this.matchForm.patchValue({
          ...data,
          dateHeure: formattedDate,
          convocations: convocationsStr,
          equipe1Id: data.equipe1Id,
          equipe2Id: data.equipe2Id
        });
      });
    }
  }

  equipesDifferentes: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const e1 = group.get('equipe1Id')?.value;
    const e2 = group.get('equipe2Id')?.value;
    return e1 && e2 && e1 === e2 ? { equipesIdentiques: true } : null;
  };

  onSubmit(): void {
    this.submitted = true;
    if (this.matchForm.invalid) return;

    const formValue = { ...this.matchForm.value };
    formValue.convocations = formValue.convocations
      ? formValue.convocations.split(',').map((j: string) => j.trim()).filter((j: string) => j.length > 0)
      : [];

    this.http.put(`http://localhost:8060/api/matches/${this.matchId}`, formValue).subscribe({
      next: () => {
        this.successMessage = 'Match modifié avec succès ✅';
      },
      error: () => {
        this.successMessage = '';
        alert('Erreur lors de la modification du match. Veuillez réessayer.');
      }
    });
  }
}
