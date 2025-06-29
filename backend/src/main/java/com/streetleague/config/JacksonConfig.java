package com.streetleague.config;

import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig
{

   @Bean
   public Jackson2ObjectMapperBuilderCustomizer jacksonObjectMapperCustomizer()
   {
      return builder -> {
         // Personnalise l'ObjectMapper ici
         builder.featuresToEnable(com.fasterxml.jackson.core.JsonGenerator.Feature.ESCAPE_NON_ASCII);
         // Ajoute d'autres modules si nécessaire
      };
   }
}
