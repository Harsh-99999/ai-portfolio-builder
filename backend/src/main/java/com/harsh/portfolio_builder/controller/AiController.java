package com.harsh.portfolio_builder.controller;
import com.harsh.portfolio_builder.dto.ai.*;
import com.harsh.portfolio_builder.service.GeminiService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/ai")
public class AiController {
    private final GeminiService service; public AiController(GeminiService service){this.service=service;}
    @PostMapping("/generate-about") public AiSuggestionResponse about(@Valid @RequestBody AiRequest r){return service.generateAbout(r);}
    @PostMapping("/improve-text") public AiSuggestionResponse improve(@Valid @RequestBody AiRequest r){return service.improveText(r);}
    @PostMapping("/project-description") public AiSuggestionResponse project(@Valid @RequestBody AiRequest r){return service.projectDescription(r);}
    @PostMapping("/experience-description") public AiSuggestionResponse experience(@Valid @RequestBody AiRequest r){return service.experienceDescription(r);}
    @PostMapping("/professional-summary") public AiSuggestionResponse summary(@Valid @RequestBody AiRequest r){return service.professionalSummary(r);}
}
