import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-match-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './match-edit.component.html',
})
export class MatchEditComponent implements OnInit {
  matchForm: FormGroup;
  submitted = false;
  isSubmitting = false;
  successMessage = '';
  matchId: string | null = null;
  equipes: any[] = [];
  isViewOnlyMode = false;
  matchData: any = {};

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router,
    public authService: AuthService
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
    // Check if this is view-only mode based on the route
    const currentUrl = this.router.url;
    this.isViewOnlyMode = currentUrl.includes('/matches/view/') || !this.authService.canCreateMatches();

    // Load teams first
    this.http.get<any[]>('http://localhost:8060/api/equipes').subscribe({
      next: (equipes) => {
        this.equipes = equipes;
      },
      error: (error) => {
        console.error('Error loading teams:', error);
      }
    });

    this.matchId = this.route.snapshot.paramMap.get('id');
    
    if (this.matchId) {
      this.http.get<any>(`http://localhost:8060/api/matches/${this.matchId}`).subscribe({
        next: (data) => {
          this.matchData = data;
          
          const formattedDate = data.dateHeure?.slice(0, 16);
          const convocationsStr = data.convocations?.join(', ') ?? '';
          
          this.matchForm.patchValue({
            ...data,
            dateHeure: formattedDate,
            convocations: convocationsStr,
            equipe1Id: data.equipe1Id,
            equipe2Id: data.equipe2Id
          });
          
          // Disable form after setting values if in view mode
          if (this.isViewOnlyMode) {
            this.matchForm.disable();
          }
        },
        error: (error) => {
          console.error('Error loading match data:', error);
        }
      });
    }
  }

  equipesDifferentes: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const e1 = group.get('equipe1Id')?.value;
    const e2 = group.get('equipe2Id')?.value;
    return e1 && e2 && e1 === e2 ? { equipesIdentiques: true } : null;
  };

  getTeamName(teamId: string): string {
    const team = this.equipes.find(eq => eq.id === teamId);
    return team ? team.nom : 'Équipe non trouvée';
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.matchForm.invalid) return;

    this.isSubmitting = true;
    const formValue = { ...this.matchForm.value };
    formValue.convocations = formValue.convocations
      ? formValue.convocations.split(',').map((j: string) => j.trim()).filter((j: string) => j.length > 0)
      : [];

    this.http.put(`http://localhost:8060/api/matches/${this.matchId}`, formValue).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Match modifié avec succès ✅';
      },
      error: () => {
        this.isSubmitting = false;
        this.successMessage = '';
        alert('Erreur lors de la modification du match. Veuillez réessayer.');
      }
    });
  }
}
