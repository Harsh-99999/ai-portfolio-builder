package com.harsh.portfolio_builder.repository;
import com.harsh.portfolio_builder.entity.Profile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProfileRepository extends JpaRepository<Profile, Long> { Optional<Profile> findByUserEmailIgnoreCase(String email); }
