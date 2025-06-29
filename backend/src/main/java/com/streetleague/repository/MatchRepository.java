package com.streetleague.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.streetleague.model.Match;

import java.util.List;

public interface MatchRepository extends MongoRepository<Match, String>
{
    List<Match> findByEventId(String eventId);
}
