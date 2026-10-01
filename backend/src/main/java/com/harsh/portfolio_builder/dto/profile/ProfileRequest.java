package com.harsh.portfolio_builder.dto.profile;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;
public record ProfileRequest(@Size(max = 120) String fullName, @Size(max = 160) String headline,
    @Size(max = 3000) String bio, @URL @Size(max = 500) String profileImageUrl, @Size(max = 120) String location,
    @Size(max = 40) String phone) {}
