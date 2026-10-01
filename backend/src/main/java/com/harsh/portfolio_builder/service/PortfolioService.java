package com.harsh.portfolio_builder.service;
import com.harsh.portfolio_builder.dto.portfolio.*;
import com.harsh.portfolio_builder.dto.profile.PublicProfileResponse;
import com.harsh.portfolio_builder.dto.project.ProjectResponse;
import com.harsh.portfolio_builder.dto.skill.SkillResponse;
import com.harsh.portfolio_builder.dto.education.EducationResponse;
import com.harsh.portfolio_builder.dto.experience.ExperienceResponse;
import com.harsh.portfolio_builder.dto.social.SocialLinkResponse;
import com.harsh.portfolio_builder.entity.Portfolio;
import com.harsh.portfolio_builder.exception.ApiException;
import com.harsh.portfolio_builder.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @Transactional
public class PortfolioService {
    private final PortfolioRepository portfolios; private final ProfileRepository profiles;
    private final SkillRepository skills; private final ProjectRepository projects;
    private final EducationRepository educations; private final ExperienceRepository experiences; private final SocialLinkRepository links;
    public PortfolioService(PortfolioRepository portfolios,ProfileRepository profiles,SkillRepository skills,ProjectRepository projects,
                           EducationRepository educations,ExperienceRepository experiences,SocialLinkRepository links) {
        this.portfolios=portfolios; this.profiles=profiles; this.skills=skills; this.projects=projects;
        this.educations=educations; this.experiences=experiences; this.links=links;
    }
    @Transactional(readOnly=true) public PortfolioResponse get(String email) { return PortfolioResponse.from(owned(email)); }
    public PortfolioResponse update(String email,PortfolioRequest request) {
        Portfolio p=owned(email);
        if(request.title()!=null) {
            if(request.title().isBlank()) throw new ApiException(HttpStatus.BAD_REQUEST,"INVALID_TITLE","Portfolio title cannot be blank");
            p.setTitle(request.title().trim());
        }
        if(request.template()!=null) p.setTemplate(request.template());
        if(request.slug()!=null && !request.slug().equals(p.getSlug())) {
            if(portfolios.existsBySlugIgnoreCase(request.slug())) throw new ApiException(HttpStatus.CONFLICT,"SLUG_IN_USE","That portfolio URL is already taken");
            p.setSlug(request.slug());
        }
        return PortfolioResponse.from(p);
    }
    public PortfolioResponse publish(String email) { Portfolio p=owned(email); p.publish(); return PortfolioResponse.from(p); }
    public PortfolioResponse unpublish(String email) { Portfolio p=owned(email); p.unpublish(); return PortfolioResponse.from(p); }
    @Transactional(readOnly=true) public PublicPortfolioResponse publicBySlug(String slug) {
        Portfolio p=portfolios.findBySlugAndPublishedTrue(slug).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,"PORTFOLIO_NOT_FOUND","Published portfolio not found"));
        String email=p.getUser().getEmail();
        var profile=profiles.findByUserEmailIgnoreCase(email).map(PublicProfileResponse::from).orElse(null);
        return new PublicPortfolioResponse(PortfolioResponse.from(p),profile,
                skills.findAllByUserEmailIgnoreCaseOrderByName(email).stream().map(SkillResponse::from).toList(),
                projects.findAllByUserEmailIgnoreCaseOrderByDisplayOrderAscNameAsc(email).stream().map(ProjectResponse::from).toList(),
                educations.findAllByUserEmailIgnoreCaseOrderByStartDateDesc(email).stream().map(EducationResponse::from).toList(),
                experiences.findAllByUserEmailIgnoreCaseOrderByStartDateDesc(email).stream().map(ExperienceResponse::from).toList(),
                links.findAllByUserEmailIgnoreCaseOrderByPlatform(email).stream().map(SocialLinkResponse::from).toList());
    }
    private Portfolio owned(String email) { return portfolios.findByUserEmailIgnoreCase(email).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,"PORTFOLIO_NOT_FOUND","Portfolio not found")); }
}
