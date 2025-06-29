package com.streetleague.exception;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler
{

   @ExceptionHandler(MethodArgumentNotValidException.class)
   public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex)
   {
      BindingResult bindingResult = ex.getBindingResult();
      Map<String, Object> errors = new HashMap<>();
      errors.put("status", HttpStatus.BAD_REQUEST.value());
      errors.put("message", "Données de la requête invalides");
      errors.put("errors",
               bindingResult.getFieldErrors().stream().map(error -> Map.of("field", error.getField(), "message", error.getDefaultMessage())).collect(Collectors.toList()));
      return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
   }
}
