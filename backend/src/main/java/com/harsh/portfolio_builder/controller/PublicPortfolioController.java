package com.harsh.portfolio_builder.controller;
import com.harsh.portfolio_builder.dto.portfolio.PublicPortfolioResponse;
import com.harsh.portfolio_builder.service.PortfolioService;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/public/portfolio")
public class PublicPortfolioController {
    private final PortfolioService service; public PublicPortfolioController(PortfolioService service) { this.service=service; }
    @GetMapping("/{slug}") public PublicPortfolioResponse get(@PathVariable String slug) { return service.publicBySlug(slug); }
}
