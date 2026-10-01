package com.harsh.portfolio_builder.dto.skill;
import com.harsh.portfolio_builder.entity.Skill;
public record SkillResponse(Long id, String name, String category) {
    public static SkillResponse from(Skill s) { return new SkillResponse(s.getId(), s.getName(), s.getCategory()); }
}
