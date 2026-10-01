package com.harsh.portfolio_builder.repository;
import com.harsh.portfolio_builder.entity.Skill;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SkillRepository extends JpaRepository<Skill, Long> { List<Skill> findAllByUserEmailIgnoreCaseOrderByName(String email); }
