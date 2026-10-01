package com.harsh.portfolio_builder.controller;
import com.harsh.portfolio_builder.dto.experience.*; import com.harsh.portfolio_builder.service.ResumeService; import jakarta.validation.Valid; import java.security.Principal; import java.util.List; import org.springframework.http.HttpStatus; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/experience") public class ExperienceController{
 private final ResumeService service; public ExperienceController(ResumeService service){this.service=service;}
 @GetMapping public List<ExperienceResponse> list(Principal p){return service.experience(p.getName());}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public ExperienceResponse create(Principal p,@Valid @RequestBody ExperienceRequest r){return service.createExperience(p.getName(),r);}
 @PutMapping("/{id}") public ExperienceResponse update(Principal p,@PathVariable Long id,@Valid @RequestBody ExperienceRequest r){return service.updateExperience(p.getName(),id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(Principal p,@PathVariable Long id){service.deleteExperience(p.getName(),id);}
}
