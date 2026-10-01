package com.harsh.portfolio_builder.controller;
import com.harsh.portfolio_builder.dto.skill.*;
import com.harsh.portfolio_builder.service.SkillService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/skills")
public class SkillController {
    private final SkillService service; public SkillController(SkillService service) { this.service=service; }
    @GetMapping public List<SkillResponse> list(Principal p) { return service.list(p.getName()); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public SkillResponse create(Principal p,@Valid @RequestBody SkillRequest r) { return service.create(p.getName(),r); }
    @PutMapping("/{id}") public SkillResponse update(Principal p,@PathVariable Long id,@Valid @RequestBody SkillRequest r) { return service.update(p.getName(),id,r); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(Principal p,@PathVariable Long id) { service.delete(p.getName(),id); }
}
