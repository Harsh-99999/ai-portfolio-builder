package com.harsh.portfolio_builder.controller;
import com.harsh.portfolio_builder.dto.github.*;
import com.harsh.portfolio_builder.dto.project.ProjectResponse;
import com.harsh.portfolio_builder.service.GithubService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/github")
public class GithubController {
    private final GithubService service; public GithubController(GithubService service){this.service=service;}
    @GetMapping("/repos/{username}") public List<GithubRepositoryDto> repos(@PathVariable String username){return service.repositories(username);}
    @PostMapping("/import") public ProjectResponse importRepo(Principal p,@Valid @RequestBody GithubImportRequest request){return service.importRepository(p.getName(),request);}
}
