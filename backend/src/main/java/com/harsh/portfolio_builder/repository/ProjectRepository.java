package com.harsh.portfolio_builder.repository;
import com.harsh.portfolio_builder.entity.Project;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByUserEmailIgnoreCaseOrderByDisplayOrderAscNameAsc(String email);
    Optional<Project> findByIdAndUserEmailIgnoreCase(Long id, String email);
    Optional<Project> findByGithubUrlAndUserEmailIgnoreCase(String githubUrl, String email);
}
