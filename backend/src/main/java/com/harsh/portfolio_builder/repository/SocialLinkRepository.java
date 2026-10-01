package com.harsh.portfolio_builder.repository;
import com.harsh.portfolio_builder.entity.SocialLink; import java.util.List; import java.util.Optional; import org.springframework.data.jpa.repository.JpaRepository;
public interface SocialLinkRepository extends JpaRepository<SocialLink,Long>{List<SocialLink> findAllByUserEmailIgnoreCaseOrderByPlatform(String email); Optional<SocialLink> findByIdAndUserEmailIgnoreCase(Long id,String email);}
