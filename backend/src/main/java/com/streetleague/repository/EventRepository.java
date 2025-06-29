package com.streetleague.repository;

import com.streetleague.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EventRepository extends MongoRepository<Event, String> {
    // Tu peux ajouter des méthodes personnalisées si besoin, par exemple chercher par nom, lieu, etc.
}