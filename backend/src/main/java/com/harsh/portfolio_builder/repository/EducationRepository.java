package com.harsh.portfolio_builder.repository;
import com.harsh.portfolio_builder.entity.Education; import java.util.List; import java.util.Optional; import org.springframework.data.jpa.repository.JpaRepository;
public interface EducationRepository extends JpaRepository<Education,Long>{List<Education> findAllByUserEmailIgnoreCaseOrderByStartDateDesc(String email); Optional<Education> findByIdAndUserEmailIgnoreCase(Long id,String email);}
