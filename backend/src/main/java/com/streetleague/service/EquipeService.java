package com.streetleague.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.streetleague.model.Equipe;
import com.streetleague.repository.EquipeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EquipeService {

    private final EquipeRepository equipeRepository;

    public Equipe ajouterEquipe(Equipe equipe) {
        return equipeRepository.save(equipe);
    }

    public Optional<Equipe> modifierEquipe(String id, Equipe details) {
        return equipeRepository.findById(id).map(equipe -> {
            equipe.setNom(details.getNom());
            equipe.setNiveau(details.getNiveau());
            equipe.setCoach(details.getCoach());
            return equipeRepository.save(equipe);
        });
    }

    public boolean supprimerEquipe(String id) {
        return equipeRepository.findById(id).map(equipe -> {
            equipeRepository.delete(equipe);
            return true;
        }).orElse(false);
    }

    public List<Equipe> getAllEquipes() {
        return equipeRepository.findAll();
    }

    public Optional<Equipe> getEquipeById(String id) {
        return equipeRepository.findById(id);
    }
}