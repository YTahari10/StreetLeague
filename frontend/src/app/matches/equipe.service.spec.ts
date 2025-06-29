import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EquipeService, Equipe } from './equipe.service';

describe('EquipeService', () => {
  let service: EquipeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EquipeService]
    });
    service = TestBed.inject(EquipeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve an equipe by id', () => {
    const dummyEquipe: Equipe = { id: '123', nom: 'Team Test', niveau: 'Pro', coach: 'John Doe' };

    service.getById('123').subscribe(equipe => {
      expect(equipe).toEqual(dummyEquipe);
    });

    const req = httpMock.expectOne('http://localhost:8090/api/equipes/123');
    expect(req.request.method).toBe('GET');
    req.flush(dummyEquipe);
  });
});
