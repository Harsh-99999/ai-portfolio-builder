package com.harsh.portfolio_builder.service;
import com.harsh.portfolio_builder.dto.education.*; import com.harsh.portfolio_builder.dto.experience.*; import com.harsh.portfolio_builder.dto.social.*;
import com.harsh.portfolio_builder.entity.*; import com.harsh.portfolio_builder.exception.ApiException;
import com.harsh.portfolio_builder.repository.*; import java.util.List; import org.springframework.http.HttpStatus; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
@Service @Transactional
public class ResumeService {
 private final EducationRepository educations; private final ExperienceRepository experiences; private final SocialLinkRepository links; private final UserRepository users;
 public ResumeService(EducationRepository educations,ExperienceRepository experiences,SocialLinkRepository links,UserRepository users){this.educations=educations;this.experiences=experiences;this.links=links;this.users=users;}
 @Transactional(readOnly=true) public List<EducationResponse> education(String email){return educations.findAllByUserEmailIgnoreCaseOrderByStartDateDesc(email).stream().map(EducationResponse::from).toList();}
 public EducationResponse createEducation(String email,EducationRequest r){Education e=new Education(user(email),r.institution().trim(),r.degree().trim());apply(e,r);return EducationResponse.from(educations.save(e));}
 public EducationResponse updateEducation(String email,Long id,EducationRequest r){Education e=educations.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->missing("EDUCATION_NOT_FOUND","Education not found"));apply(e,r);return EducationResponse.from(e);}
 public void deleteEducation(String email,Long id){educations.delete(educations.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->missing("EDUCATION_NOT_FOUND","Education not found")));}
 private void apply(Education e,EducationRequest r){e.setInstitution(r.institution().trim());e.setDegree(r.degree().trim());e.setFieldOfStudy(r.fieldOfStudy());e.setStartDate(r.startDate());e.setEndDate(r.endDate());e.setDescription(r.description());}
 @Transactional(readOnly=true) public List<ExperienceResponse> experience(String email){return experiences.findAllByUserEmailIgnoreCaseOrderByStartDateDesc(email).stream().map(ExperienceResponse::from).toList();}
 public ExperienceResponse createExperience(String email,ExperienceRequest r){Experience e=new Experience(user(email),r.company().trim(),r.position().trim());apply(e,r);return ExperienceResponse.from(experiences.save(e));}
 public ExperienceResponse updateExperience(String email,Long id,ExperienceRequest r){Experience e=experiences.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->missing("EXPERIENCE_NOT_FOUND","Experience not found"));apply(e,r);return ExperienceResponse.from(e);}
 public void deleteExperience(String email,Long id){experiences.delete(experiences.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->missing("EXPERIENCE_NOT_FOUND","Experience not found")));}
 private void apply(Experience e,ExperienceRequest r){e.setCompany(r.company().trim());e.setPosition(r.position().trim());e.setLocation(r.location());e.setStartDate(r.startDate());e.setEndDate(r.currentlyWorking()?null:r.endDate());e.setCurrentlyWorking(r.currentlyWorking());e.setDescription(r.description());}
 @Transactional(readOnly=true) public List<SocialLinkResponse> links(String email){return links.findAllByUserEmailIgnoreCaseOrderByPlatform(email).stream().map(SocialLinkResponse::from).toList();}
 public SocialLinkResponse createLink(String email,SocialLinkRequest r){return SocialLinkResponse.from(links.save(new SocialLink(user(email),r.platform().trim(),r.url().trim())));}
 public SocialLinkResponse updateLink(String email,Long id,SocialLinkRequest r){SocialLink s=links.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->missing("SOCIAL_LINK_NOT_FOUND","Social link not found"));s.setPlatform(r.platform().trim());s.setUrl(r.url().trim());return SocialLinkResponse.from(s);}
 public void deleteLink(String email,Long id){links.delete(links.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->missing("SOCIAL_LINK_NOT_FOUND","Social link not found")));}
 private User user(String email){return users.findByEmailIgnoreCase(email).orElseThrow(()->missing("USER_NOT_FOUND","User not found"));}
 private ApiException missing(String code,String message){return new ApiException(HttpStatus.NOT_FOUND,code,message);}
}
