package com.streetleague.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.streetleague.model.Equipe;

public interface EquipeRepository extends MongoRepository<Equipe, String> {
    // Tu peux ajouter des méthodes personnalisées si besoin
}