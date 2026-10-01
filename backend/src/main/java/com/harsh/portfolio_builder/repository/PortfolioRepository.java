package com.harsh.portfolio_builder.repository;
import com.harsh.portfolio_builder.entity.Portfolio;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    Optional<Portfolio> findByUserEmailIgnoreCase(String email);
    Optional<Portfolio> findBySlugAndPublishedTrue(String slug);
    boolean existsBySlugIgnoreCase(String slug);
}
