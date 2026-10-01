package com.harsh.portfolio_builder.dto.profile;
import com.harsh.portfolio_builder.entity.Profile;
public record ProfileResponse(String email, String fullName, String headline, String bio, String profileImageUrl, String location, String phone) {
    public static ProfileResponse from(Profile p) { return new ProfileResponse(p.getUser().getEmail(), p.getFullName(), p.getHeadline(), p.getBio(), p.getProfileImageUrl(), p.getLocation(), p.getPhone()); }
}
