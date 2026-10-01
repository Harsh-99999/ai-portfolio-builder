package com.harsh.portfolio_builder.service;
import com.harsh.portfolio_builder.dto.skill.*;
import com.harsh.portfolio_builder.entity.Skill;
import com.harsh.portfolio_builder.exception.ApiException;
import com.harsh.portfolio_builder.repository.SkillRepository;
import com.harsh.portfolio_builder.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @Transactional
public class SkillService {
    private final SkillRepository skills; private final UserRepository users;
    public SkillService(SkillRepository skills, UserRepository users) { this.skills=skills; this.users=users; }
    @Transactional(readOnly=true) public List<SkillResponse> list(String email) { return skills.findAllByUserEmailIgnoreCaseOrderByName(email).stream().map(SkillResponse::from).toList(); }
    public SkillResponse create(String email, SkillRequest request) { return SkillResponse.from(skills.save(new Skill(user(email), request.name().trim(), request.category()))); }
    public SkillResponse update(String email, Long id, SkillRequest request) { Skill s=owned(email,id); s.setName(request.name().trim()); s.setCategory(request.category()); return SkillResponse.from(s); }
    public void delete(String email, Long id) { skills.delete(owned(email,id)); }
    private Skill owned(String email, Long id) { return skills.findById(id).filter(s -> s.getUser().getEmail().equalsIgnoreCase(email)).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,"SKILL_NOT_FOUND","Skill not found")); }
    private com.harsh.portfolio_builder.entity.User user(String email) { return users.findByEmailIgnoreCase(email).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,"USER_NOT_FOUND","User not found")); }
}
