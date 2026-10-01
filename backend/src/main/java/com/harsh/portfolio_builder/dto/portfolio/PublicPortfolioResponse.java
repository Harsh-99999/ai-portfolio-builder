package com.harsh.portfolio_builder.dto.portfolio;
import com.harsh.portfolio_builder.dto.profile.PublicProfileResponse;
import com.harsh.portfolio_builder.dto.project.ProjectResponse;
import com.harsh.portfolio_builder.dto.skill.SkillResponse;
import com.harsh.portfolio_builder.dto.education.EducationResponse;
import com.harsh.portfolio_builder.dto.experience.ExperienceResponse;
import com.harsh.portfolio_builder.dto.social.SocialLinkResponse;
import java.util.List;
public record PublicPortfolioResponse(PortfolioResponse portfolio, PublicProfileResponse profile,
                                      List<SkillResponse> skills, List<ProjectResponse> projects,
                                      List<EducationResponse> education, List<ExperienceResponse> experience,
                                      List<SocialLinkResponse> socialLinks) {}
