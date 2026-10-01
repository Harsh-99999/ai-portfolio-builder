package com.harsh.portfolio_builder.repository;
import com.harsh.portfolio_builder.entity.Experience; import java.util.List; import java.util.Optional; import org.springframework.data.jpa.repository.JpaRepository;
public interface ExperienceRepository extends JpaRepository<Experience,Long>{List<Experience> findAllByUserEmailIgnoreCaseOrderByStartDateDesc(String email); Optional<Experience> findByIdAndUserEmailIgnoreCase(Long id,String email);}
