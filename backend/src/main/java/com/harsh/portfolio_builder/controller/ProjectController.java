package com.harsh.portfolio_builder.controller;
import com.harsh.portfolio_builder.dto.project.*;
import com.harsh.portfolio_builder.service.ProjectService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService service; public ProjectController(ProjectService service) { this.service=service; }
    @GetMapping public List<ProjectResponse> list(Principal p) { return service.list(p.getName()); }
    @GetMapping("/{id}") public ProjectResponse get(Principal p,@PathVariable Long id) { return service.get(p.getName(),id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public ProjectResponse create(Principal p,@Valid @RequestBody ProjectRequest r) { return service.create(p.getName(),r); }
    @PutMapping("/{id}") public ProjectResponse update(Principal p,@PathVariable Long id,@Valid @RequestBody ProjectRequest r) { return service.update(p.getName(),id,r); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(Principal p,@PathVariable Long id) { service.delete(p.getName(),id); }
}
