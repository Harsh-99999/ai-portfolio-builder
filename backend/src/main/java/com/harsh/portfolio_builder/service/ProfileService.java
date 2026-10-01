package com.harsh.portfolio_builder.service;
import com.harsh.portfolio_builder.dto.profile.*;
import com.harsh.portfolio_builder.entity.Profile;
import com.harsh.portfolio_builder.exception.ApiException;
import com.harsh.portfolio_builder.repository.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @Transactional
public class ProfileService {
    private final ProfileRepository profiles;
    public ProfileService(ProfileRepository profiles) { this.profiles = profiles; }
    @Transactional(readOnly = true) public ProfileResponse get(String email) { return ProfileResponse.from(find(email)); }
    public ProfileResponse update(String email, ProfileRequest request) {
        Profile p = find(email); p.setFullName(request.fullName()); p.setHeadline(request.headline()); p.setBio(request.bio());
        p.setProfileImageUrl(request.profileImageUrl()); p.setLocation(request.location()); p.setPhone(request.phone()); return ProfileResponse.from(p);
    }
    private Profile find(String email) { return profiles.findByUserEmailIgnoreCase(email).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,"PROFILE_NOT_FOUND","Profile not found")); }
}
