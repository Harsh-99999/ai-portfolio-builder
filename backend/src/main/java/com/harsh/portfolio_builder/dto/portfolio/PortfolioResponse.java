package com.harsh.portfolio_builder.dto.portfolio;
import com.harsh.portfolio_builder.entity.Portfolio;
import java.time.Instant;
public record PortfolioResponse(String title, String slug, String template, boolean published, Instant publishedAt) {
    public static PortfolioResponse from(Portfolio p) { return new PortfolioResponse(p.getTitle(), p.getSlug(), p.getTemplate(), p.isPublished(), p.getPublishedAt()); }
}
