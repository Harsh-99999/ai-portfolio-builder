package com.harsh.portfolio_builder.controller;
import com.harsh.portfolio_builder.dto.portfolio.*;
import com.harsh.portfolio_builder.service.PortfolioService;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/portfolio")
public class PortfolioController {
    private final PortfolioService service; public PortfolioController(PortfolioService service) { this.service=service; }
    @GetMapping public PortfolioResponse get(Principal p) { return service.get(p.getName()); }
    @PutMapping public PortfolioResponse update(Principal p,@Valid @RequestBody PortfolioRequest r) { return service.update(p.getName(),r); }
    @PostMapping("/publish") public PortfolioResponse publish(Principal p) { return service.publish(p.getName()); }
    @PostMapping("/unpublish") public PortfolioResponse unpublish(Principal p) { return service.unpublish(p.getName()); }
}
