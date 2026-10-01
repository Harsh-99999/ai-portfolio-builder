package com.harsh.portfolio_builder.controller;
import com.harsh.portfolio_builder.dto.social.*; import com.harsh.portfolio_builder.service.ResumeService; import jakarta.validation.Valid; import java.security.Principal; import java.util.List; import org.springframework.http.HttpStatus; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/social-links") public class SocialLinkController{
 private final ResumeService service; public SocialLinkController(ResumeService service){this.service=service;}
 @GetMapping public List<SocialLinkResponse> list(Principal p){return service.links(p.getName());}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public SocialLinkResponse create(Principal p,@Valid @RequestBody SocialLinkRequest r){return service.createLink(p.getName(),r);}
 @PutMapping("/{id}") public SocialLinkResponse update(Principal p,@PathVariable Long id,@Valid @RequestBody SocialLinkRequest r){return service.updateLink(p.getName(),id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(Principal p,@PathVariable Long id){service.deleteLink(p.getName(),id);}
}
