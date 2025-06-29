package com.streetleague.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.streetleague.model.Invitation;

import java.util.List;

public interface InvitationRepository extends MongoRepository<Invitation, String> {
    // Méthodes personnalisées à ajouter si besoin
    List<Invitation> findByMatchId(String matchId);

}
