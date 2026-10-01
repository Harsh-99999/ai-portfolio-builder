package com.harsh.portfolio_builder.controller;
import com.harsh.portfolio_builder.dto.education.*; import com.harsh.portfolio_builder.service.ResumeService; import jakarta.validation.Valid; import java.security.Principal; import java.util.List; import org.springframework.http.HttpStatus; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/education") public class EducationController{
 private final ResumeService service; public EducationController(ResumeService service){this.service=service;}
 @GetMapping public List<EducationResponse> list(Principal p){return service.education(p.getName());}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public EducationResponse create(Principal p,@Valid @RequestBody EducationRequest r){return service.createEducation(p.getName(),r);}
 @PutMapping("/{id}") public EducationResponse update(Principal p,@PathVariable Long id,@Valid @RequestBody EducationRequest r){return service.updateEducation(p.getName(),id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(Principal p,@PathVariable Long id){service.deleteEducation(p.getName(),id);}
}
