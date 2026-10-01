package com.harsh.portfolio_builder.service;
import com.harsh.portfolio_builder.dto.project.*;
import com.harsh.portfolio_builder.entity.Project;
import com.harsh.portfolio_builder.exception.ApiException;
import com.harsh.portfolio_builder.repository.ProjectRepository;
import com.harsh.portfolio_builder.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @Transactional
public class ProjectService {
    private final ProjectRepository projects; private final UserRepository users;
    public ProjectService(ProjectRepository projects, UserRepository users) { this.projects=projects; this.users=users; }
    @Transactional(readOnly=true) public List<ProjectResponse> list(String email) { return projects.findAllByUserEmailIgnoreCaseOrderByDisplayOrderAscNameAsc(email).stream().map(ProjectResponse::from).toList(); }
    @Transactional(readOnly=true) public ProjectResponse get(String email,Long id) { return ProjectResponse.from(owned(email,id)); }
    public ProjectResponse create(String email, ProjectRequest r) { Project p=new Project(user(email),r.name().trim()); apply(p,r); return ProjectResponse.from(projects.save(p)); }
    public ProjectResponse update(String email, Long id, ProjectRequest r) { Project p=owned(email,id); apply(p,r); return ProjectResponse.from(p); }
    public void delete(String email, Long id) { projects.delete(owned(email,id)); }
    private void apply(Project p,ProjectRequest r) { p.setName(r.name().trim()); p.setShortDescription(r.shortDescription()); p.setDescription(r.description()); p.setImageUrl(r.imageUrl()); p.setGithubUrl(r.githubUrl()); p.setLiveUrl(r.liveUrl()); p.setTechnologies(r.technologies()); p.setDisplayOrder(r.displayOrder()); }
    private Project owned(String email,Long id) { return projects.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,"PROJECT_NOT_FOUND","Project not found")); }
    private com.harsh.portfolio_builder.entity.User user(String email) { return users.findByEmailIgnoreCase(email).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,"USER_NOT_FOUND","User not found")); }
}
