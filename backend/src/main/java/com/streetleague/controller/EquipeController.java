package com.streetleague.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.streetleague.model.Equipe;
import com.streetleague.service.EquipeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/equipes")
@RequiredArgsConstructor
public class EquipeController {

    private final EquipeService equipeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Equipe ajouterEquipe(@RequestBody @Valid Equipe equipe) {
        return equipeService.ajouterEquipe(equipe);
    }

    @PutMapping("/{id}")
    public Equipe modifierEquipe(@PathVariable String id, @RequestBody Equipe equipeDetails) {
        return equipeService.modifierEquipe(id, equipeDetails)
                .orElseThrow(() -> new RuntimeException("Équipe non trouvée"));
    }

    @DeleteMapping("/{id}")
    public void supprimerEquipe(@PathVariable String id) {
        if (!equipeService.supprimerEquipe(id)) {
            throw new RuntimeException("Équipe non trouvée");
        }
    }

    @GetMapping
    public List<Equipe> getAllEquipes() {
        return equipeService.getAllEquipes();
    }

    @GetMapping("/{id}")
    public Equipe getEquipeById(@PathVariable String id) {
        return equipeService.getEquipeById(id)
                .orElseThrow(() -> new RuntimeException("Équipe non trouvée"));
    }
}